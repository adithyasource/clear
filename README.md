# clear
 
hey there! this project is still in the works, any pr's are welcome!
"watch" the repo to be notified of updates, 1.0 will be out soon!

![image](https://github.com/adithyasource/clear/assets/140549783/33e951c0-61dd-4ecd-9c0e-d1c413e6f888)


## Getting Started

If you want to set up and build the app by yourself in order to change some features for yourself (and maybe even re-distribute your own version!) or if you want to help out with fixing some bugs and submitting a PR, follow this simple guide!

### Prerequisites

First you gotta have [Node.js](https://nodejs.org/en/download) along with npm, pnpm or yarn installed. I'd reccomend [pnpm](https://pnpm.io/installation) since its really fast for me. \
[Rust](https://www.rust-lang.org/tools/install/) must also be installed on your system. \
Also [Git](https://git-scm.com/downloads) is a must.

### Setting It Up

1. Clone the repo
   ```sh
   git clone https://github.com/adithyasource/clear
   ```
2. Enter the folder
   ```sh
   cd clear
   ```
3. Install NPM packages
   ```sh
   pnpm install
   ```
4. Run the app for development
   ```sh
   pnpm run tauri dev
   ```
5. Build the app
   ```sh
   pnpm run tauri build
   ```

And you're done!

### Compressing It

This step is optional but this is what I'm doing in order to get the final installer and portable .exe size smaller along with other optimizations. Also I've tested these steps only on Windows. \

1. First you must have UPX installed on your system. Download the latest version [here](https://github.com/upx/upx/releases/tag/v4.2.1) and extract it to the "clear\src-tauri\target\release" folder for easy access. \

2. After you've built the app, you should find a final executable in the same path "clear\src-tauri\target\release" \ 

3. Open a terminal in that folder and run the following command
   ```sh
   .\upx.exe --ultra-brute .\clear.exe
   ```
   You should have a very lightweight and compressed .exe with you which will work without installing and can be copied to any directory.

### Creating An Installer

This step is even more optional but if you also want to create an installer for this compressed .exe, follow these steps. \

1. First you must have [NSIS](https://nsis.sourceforge.io/Download) installed.
   
2. For easier access, copy all the files from the directory where NSIS is installed, by deafult this should be "C:\Program Files (x86)\NSIS" into the "clear\NSIS" folder. You'll be asked if you want to replace the old "installer.nsi" file. Select "Skip this file" 

3. Open a terminal session inside "clear\NSIS\Bin" and then run the following command
   ```sh
   .\makensis.exe .\installer.nsi
   ```
   You should now have an installer for the .exe file (compressed or not) that you have generated in the "clear\src-tauri\target\release" folder by building the application.

   
