# What?

Command-line tool to invoke arbitrary commands or scripts on multiple operating systems without having to worry about OS-specific path-separators.

Works nicely with similar modules like cross-env to make it easier to write OS-agnostic npm script commands that work under both Windows and *\nix.

# Why?

You have a directory:
 - \<repo root>
	 - scripts
		 - mybuildscript

You would like to invoke the script from an npm command in package.json:

    {
      "scripts": {
        "build": "PATH_TO_MYBUILDSCRIPT"
      },
    }
    
But no matter what you try:

 - ./scripts/mybuildscript (Windows: `'.' is not recognized as an internal or external command, operable program or batch file.`)
 - scripts/mybuildscript (Windows: `'scripts' is not recognized as an internal or external command, operable program or batch file.`)
 - scripts\mybuildscript (bash: `bash: scriptsmybuildscript: command not found`)
 - .\scripts\mybuildscript (bash: `bash: .scriptsmybuildscript: command not found`)
 - scripts\\mybuildscript (bash: `bash: scripts\mybuildscript: command not found`)
 - .\\scripts\\mybuildscript (bash: `bash: .\scripts\mybuildscript: command not found`)

...you can't invoke that script in a cross-platform way.

# How?

`npm install --save-dev cross-shell`

...then:

`cross-shell ./scripts/mybuildscript`  
or: `cross-shell scripts/mybuildscript`  
or: `cross-shell .\\scripts\\mybuildscript`  
or: `cross-shell scripts\\mybuildscript`  
or: `cross-shell ".\scripts\mybuildscript"`  
or: `cross-shell "scripts\mybuildscript"`

## What if I need to run different scripts on different OSs?

That's a little outside of the scope of this module, but you can easily make this work by using the fact \*nix will run an extension-less file as long as it has the executable bit set (`chmod +x filename`), while Windows' `cmd.exe` won't execute a file without an extension, but *will* automatically execute a file with the provided name and a `.bat` or `.cmd` extension:

 - \<repo root>
	 - scripts
		 - mybuildscript (\*nix script)
		 - mybuildscript.cmd	(Windows script)

\*nix: `cd scripts && ./mybuildscript` (Runs mybuildscript)
Windows: `cd scripts && mybuildscript` (Runs mybuildscript.cmd)

As cross-shell delegates execution of the command to the OS's native shell (which uses its own heuristics for which actual file to execute), you can simply call `cross-shell scripts/mybuildscript` and it will automatically run the right script on each OS.

# Caveats

By default `node` (and hence `cross-shell`) selects the **native** shell for your OS to execute the passed command in. 

Normally this will be the same as the shell you're invoking `cross-shell` from, but if you use a non-native shell then it will be different - for example when running bash under WSL in Windows your command will execute in a cmd.exe shell, not in a bash shell.