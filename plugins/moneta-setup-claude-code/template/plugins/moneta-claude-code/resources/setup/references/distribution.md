# Installer and runtime distribution

The moneta-setup installer exposes only init. It is available as a native Codex/Claude plugin or the self-contained standalone skill. All generated runtime assets are bundled locally. Follow [install and enable](install-generated.md) to install the personalized plugin from its own repository; do not reinstall the template development source as the runtime.

Runtime packages contain six skills, native hooks and analysis/evaluation roles. Resolve all role and skill pointers from the originating runtime root. Claude discovers its bundled roles; Codex can delegate with the bundled role text. Project TOML registration is optional and only performed for explicit enrollment. Native hook trust and fresh-chat loading remain host controls.
