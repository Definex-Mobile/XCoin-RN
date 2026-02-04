import ExpoModulesCore

public class DeviceSecurityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("DeviceSecurity")
    
    AsyncFunction("isJailbroken") { () -> Bool in
      return checkJailbreak()
    }
  }
  
  private func checkJailbreak() -> Bool {
    // Check 1: Suspicious files and paths
    let suspiciousPaths = [
      "/Applications/Cydia.app",
      "/Applications/Sileo.app",
      "/Applications/Zebra.app",
      "/Library/MobileSubstrate/MobileSubstrate.dylib",
      "/bin/bash",
      "/usr/sbin/sshd",
      "/etc/apt",
      "/private/var/lib/apt/",
      "/private/var/lib/cydia",
      "/private/var/stash",
      "/private/var/tmp/cydia.log",
      "/usr/bin/ssh",
      "/usr/libexec/sftp-server",
      "/usr/libexec/ssh-keysign",
      "/var/cache/apt",
      "/var/lib/cydia",
      "/usr/sbin/frida-server",
      "/usr/bin/cycript",
      "/usr/local/bin/cycript",
      "/usr/lib/libcycript.dylib",
      "/System/Library/LaunchDaemons/com.saurik.Cydia.Startup.plist",
      "/System/Library/LaunchDaemons/com.ikey.bbot.plist"
    ]
    
    for path in suspiciousPaths {
      if FileManager.default.fileExists(atPath: path) {
        return true
      }
    }
    
    // Check 2: Can write to system directories (jailbroken devices allow this)
    let testPath = "/private/jailbreak_test.txt"
    do {
      try "test".write(toFile: testPath, atomically: true, encoding: .utf8)
      try FileManager.default.removeItem(atPath: testPath)
      return true // Should not be able to write here
    } catch {
      // Normal behavior - cannot write to system directories
    }
    
    // Check 3: Check if /Applications is a symbolic link
    do {
      let attributes = try FileManager.default.attributesOfItem(atPath: "/Applications")
      if let fileType = attributes[.type] as? FileAttributeType, fileType == .typeSymbolicLink {
        return true
      }
    } catch {
      // Ignore errors
    }
    
    // Check 4: URL scheme check for Cydia
    if let url = URL(string: "cydia://package/com.example.package") {
      if UIApplication.shared.canOpenURL(url) {
        return true
      }
    }
    
    // Check 5: Fork detection (sandboxed apps cannot fork)
    #if !targetEnvironment(simulator)
    let pid = fork()
    if pid >= 0 {
      if pid > 0 {
        // Parent process - kill child
        kill(pid, SIGTERM)
      }
      return true // Fork succeeded, device is jailbroken
    }
    #endif
    
    // Check 6: Dyld environment variable check
    if let env = getenv("DYLD_INSERT_LIBRARIES") {
      let value = String(cString: env)
      if !value.isEmpty {
        return true
      }
    }
    
    return false
  }
}
