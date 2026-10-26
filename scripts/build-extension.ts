import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import esbuild from 'esbuild';
import AdmZip from 'adm-zip';

async function buildExtension() {
  console.log('🚀 Building RIPOSTE Extension JS bundle via esbuild...');
  const workspaceRoot = process.cwd();
  const extensionDir = path.join(workspaceRoot, 'extension');
  const outDir = path.join(extensionDir, 'out');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Compile Extension TypeScript code to single bundle
  await esbuild.build({
    entryPoints: [path.join(extensionDir, 'src', 'extension.ts')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'cjs',
    outfile: path.join(outDir, 'extension.js'),
    sourcemap: false,
    minify: false,
    external: ['vscode']
  });

  console.log('✅ Compiled extension/out/extension.js');

  // 2. Prepare VSIX package layout using AdmZip
  console.log('📦 Assembling RIPOSTE VSIX package (riposte-extension-1.0.0.vsix)...');
  const zip = new AdmZip();

  // Create VS Code VSIX required manifest files
  const vsixManifest = `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011">
  <Metadata>
    <Identity Id="riposte-extension" Version="1.0.0" Publisher="aistudio-build" Language="en-US" />
    <DisplayName>RIPOSTE — Native Clang/LLVM + Rust + Gemini AI Extension</DisplayName>
    <Description>Complete Native Clang/LLVM and Rust development environment with Gemini 3.8 Flash AI assistant, Ghost Text, and Termux ARM64 support.</Description>
    <Tags>rust,c,cpp,clang,llvm,gemini,ai,termux,code-oss</Tags>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code" Version="[1.85.0, 2.0.0)" />
  </Installation>
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
  </Assets>
</PackageManifest>`;

  const contentTypes = `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="json" ContentType="application/json" />
  <Default Extension="js" ContentType="application/javascript" />
  <Default Extension="md" ContentType="text/markdown" />
  <Default Extension="xml" ContentType="text/xml" />
  <Default Extension="vsixmanifest" ContentType="text/xml" />
</Types>`;

  zip.addFile('extension.vsixmanifest', Buffer.from(vsixManifest, 'utf-8'));
  zip.addFile('[Content_Types].xml', Buffer.from(contentTypes, 'utf-8'));

  // Add extension directory files
  const pkgJsonContent = fs.readFileSync(path.join(extensionDir, 'package.json'), 'utf-8');
  zip.addFile('extension/package.json', Buffer.from(pkgJsonContent, 'utf-8'));

  const extensionJsContent = fs.readFileSync(path.join(outDir, 'extension.js'), 'utf-8');
  zip.addFile('extension/out/extension.js', Buffer.from(extensionJsContent, 'utf-8'));

  if (fs.existsSync(path.join(workspaceRoot, 'README.md'))) {
    zip.addFile('extension/README.md', fs.readFileSync(path.join(workspaceRoot, 'README.md')));
  }
  if (fs.existsSync(path.join(workspaceRoot, 'RESEARCH.md'))) {
    zip.addFile('extension/RESEARCH.md', fs.readFileSync(path.join(workspaceRoot, 'RESEARCH.md')));
  }

  // Save VSIX output file in workspace root
  const vsixFileName = 'riposte-extension-1.0.0.vsix';
  const vsixPath = path.join(workspaceRoot, vsixFileName);
  zip.writeZip(vsixPath);

  const vsixBuffer = fs.readFileSync(vsixPath);
  const sha256 = crypto.createHash('sha256').update(vsixBuffer).digest('hex');
  const sizeBytes = vsixBuffer.length;

  console.log(`🎉 VSIX Created Successfully!`);
  console.log(`📍 File Path: ${vsixPath}`);
  console.log(`📏 File Size: ${sizeBytes} bytes (${(sizeBytes / 1024).toFixed(2)} KB)`);
  console.log(`🔑 SHA-256 Checksum: ${sha256}`);

  // Also write an artifact metadata report file
  const artifactInfo = {
    fileName: vsixFileName,
    filePath: vsixPath,
    sizeBytes,
    sha256,
    buildTimestamp: new Date().toISOString()
  };
  fs.writeFileSync(path.join(workspaceRoot, 'vsix-artifact.json'), JSON.stringify(artifactInfo, null, 2), 'utf-8');
}

buildExtension().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
