package expo.modules.devicesecurity

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.os.Build
import java.io.File
import java.io.BufferedReader
import java.io.InputStreamReader

class DeviceSecurityModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("DeviceSecurity")
    
    AsyncFunction("isRooted") {
      checkRoot()
    }
  }
  
  private fun checkRoot(): Boolean {
    return checkSuBinary() || 
           checkRootApps() || 
           checkBuildTags() || 
           checkSystemProperties() || 
           checkBusybox() || 
           checkRWSystem()
  }
  
  // Check 1: Look for SU binary in common locations
  private fun checkSuBinary(): Boolean {
    val paths = arrayOf(
      "/system/app/Superuser.apk",
      "/sbin/su",
      "/system/bin/su",
      "/system/xbin/su",
      "/data/local/xbin/su",
      "/data/local/bin/su",
      "/system/sd/xbin/su",
      "/system/bin/failsafe/su",
      "/data/local/su",
      "/su/bin/su",
      "/su/bin",
      "/system/xbin/daemonsu"
    )
    
    for (path in paths) {
      if (File(path).exists()) {
        return true
      }
    }
    
    // Check PATH environment variable
    val pathEnv = System.getenv("PATH") ?: return false
    for (path in pathEnv.split(":")) {
      val suFile = File(path, "su")
      if (suFile.exists() && suFile.canExecute()) {
        return true
      }
    }
    
    return false
  }
  
  // Check 2: Look for root management apps
  private fun checkRootApps(): Boolean {
    val rootApps = arrayOf(
      "com.noshufou.android.su",
      "com.noshufou.android.su.elite",
      "eu.chainfire.supersu",
      "com.koushikdutta.superuser",
      "com.thirdparty.superuser",
      "com.yellowes.su",
      "com.topjohnwu.magisk",
      "com.kingroot.kinguser",
      "com.kingo.root",
      "com.smedialink.oneclickroot",
      "com.zhiqupk.root.global",
      "com.alephzain.framaroot"
    )
    
    val pm = appContext.reactContext?.packageManager ?: return false
    
    for (packageName in rootApps) {
      try {
        pm.getPackageInfo(packageName, 0)
        return true // Package found
      } catch (e: Exception) {
        // Package not found, continue
      }
    }
    
    return false
  }
  
  // Check 3: Check build tags for test-keys
  private fun checkBuildTags(): Boolean {
    val buildTags = Build.TAGS
    return buildTags != null && buildTags.contains("test-keys")
  }
  
  // Check 4: Check system properties
  private fun checkSystemProperties(): Boolean {
    val properties = mapOf(
      "ro.debuggable" to "1",
      "ro.secure" to "0"
    )
    
    for ((key, suspiciousValue) in properties) {
      val value = getSystemProperty(key)
      if (value == suspiciousValue) {
        return true
      }
    }
    
    return false
  }
  
  private fun getSystemProperty(key: String): String? {
    return try {
      val process = Runtime.getRuntime().exec("getprop $key")
      val reader = BufferedReader(InputStreamReader(process.inputStream))
      val value = reader.readLine()
      process.waitFor()
      value
    } catch (e: Exception) {
      null
    }
  }
  
  // Check 5: Check for Busybox
  private fun checkBusybox(): Boolean {
    val paths = arrayOf(
      "/system/xbin/busybox",
      "/system/bin/busybox",
      "/sbin/busybox",
      "/data/local/xbin/busybox",
      "/data/local/bin/busybox"
    )
    
    for (path in paths) {
      if (File(path).exists()) {
        return true
      }
    }
    
    return false
  }
  
  // Check 6: Check if /system is mounted as read-write
  private fun checkRWSystem(): Boolean {
    return try {
      val process = Runtime.getRuntime().exec("mount")
      val reader = BufferedReader(InputStreamReader(process.inputStream))
      var line: String?
      
      while (reader.readLine().also { line = it } != null) {
        val parts = line?.split(" ") ?: continue
        if (parts.size >= 4) {
          val mountPoint = parts[2]
          val permissions = parts[3]
          
          if (mountPoint == "/system" && permissions.contains("rw")) {
            return true
          }
        }
      }
      
      process.waitFor()
      false
    } catch (e: Exception) {
      false
    }
  }
}
