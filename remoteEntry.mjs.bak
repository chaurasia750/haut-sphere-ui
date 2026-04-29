/******/ var __webpack_modules__ = ({

/***/ "../node_modules/.federation/entry.95a9b3ff803c35eac759343ab00542c2.js"
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {


// NAMESPACE OBJECT: ../node_modules/@module-federation/runtime/dist/bundler.js
var bundler_namespaceObject = {};
__webpack_require__.r(bundler_namespaceObject);
__webpack_require__.d(bundler_namespaceObject, {
  Module: () => (Module$1),
  ModuleFederation: () => (ModuleFederation),
  createInstance: () => (createInstance),
  getInstance: () => (getInstance),
  getRemoteEntry: () => (getRemoteEntry),
  getRemoteInfo: () => (getRemoteInfo),
  init: () => (init),
  loadRemote: () => (loadRemote),
  loadScript: () => (loadScript),
  loadScriptNode: () => (loadScriptNode),
  loadShare: () => (loadShare),
  loadShareSync: () => (loadShareSync),
  preloadRemote: () => (preloadRemote),
  registerGlobalPlugins: () => (registerGlobalPlugins),
  registerPlugins: () => (dist_registerPlugins),
  registerRemotes: () => (registerRemotes),
  registerShared: () => (registerShared)
});

;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/attachShareScopeMap.js
//#region src/attachShareScopeMap.ts
function attachShareScopeMap(webpackRequire) {
	if (!webpackRequire.S || webpackRequire.federation.hasAttachShareScopeMap || !webpackRequire.federation.instance || !webpackRequire.federation.instance.shareScopeMap) return;
	webpackRequire.S = webpackRequire.federation.instance.shareScopeMap;
	webpackRequire.federation.hasAttachShareScopeMap = true;
}

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/constant.js
//#region src/constant.ts
const FEDERATION_SUPPORTED_TYPES = ["script"];

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/updateOptions.js
//#region src/updateOptions.ts
function updateConsumeOptions(options) {
	const { webpackRequire, moduleToHandlerMapping } = options;
	const { consumesLoadingData, initializeSharingData } = webpackRequire;
	const { sharedFallback, bundlerRuntime, libraryType } = webpackRequire.federation;
	if (consumesLoadingData && !consumesLoadingData._updated) {
		const { moduleIdToConsumeDataMapping: updatedModuleIdToConsumeDataMapping = {}, initialConsumes: updatedInitialConsumes = [], chunkMapping: updatedChunkMapping = {} } = consumesLoadingData;
		Object.entries(updatedModuleIdToConsumeDataMapping).forEach(([id, data]) => {
			if (!moduleToHandlerMapping[id]) moduleToHandlerMapping[id] = {
				getter: sharedFallback ? bundlerRuntime?.getSharedFallbackGetter({
					shareKey: data.shareKey,
					factory: data.fallback,
					webpackRequire,
					libraryType
				}) : data.fallback,
				treeShakingGetter: sharedFallback ? data.fallback : void 0,
				shareInfo: {
					shareConfig: {
						requiredVersion: data.requiredVersion,
						strictVersion: data.strictVersion,
						singleton: data.singleton,
						eager: data.eager,
						layer: data.layer
					},
					scope: Array.isArray(data.shareScope) ? data.shareScope : [data.shareScope || "default"],
					treeShaking: sharedFallback ? {
						get: data.fallback,
						mode: data.treeShakingMode
					} : void 0
				},
				shareKey: data.shareKey
			};
		});
		if ("initialConsumes" in options) {
			const { initialConsumes = [] } = options;
			updatedInitialConsumes.forEach((id) => {
				if (!initialConsumes.includes(id)) initialConsumes.push(id);
			});
		}
		if ("chunkMapping" in options) {
			const { chunkMapping = {} } = options;
			Object.entries(updatedChunkMapping).forEach(([id, chunkModules]) => {
				if (!chunkMapping[id]) chunkMapping[id] = [];
				chunkModules.forEach((moduleId) => {
					if (!chunkMapping[id].includes(moduleId)) chunkMapping[id].push(moduleId);
				});
			});
		}
		consumesLoadingData._updated = 1;
	}
	if (initializeSharingData && !initializeSharingData._updated) {
		const { federation } = webpackRequire;
		if (!federation.instance || !initializeSharingData.scopeToSharingDataMapping) return;
		const shared = {};
		for (let [scope, stages] of Object.entries(initializeSharingData.scopeToSharingDataMapping)) for (let stage of stages) if (typeof stage === "object" && stage !== null) {
			const { name, version, factory, eager, singleton, requiredVersion, strictVersion } = stage;
			const shareConfig = { requiredVersion: `^${version}` };
			const isValidValue = function(val) {
				return typeof val !== "undefined";
			};
			if (isValidValue(singleton)) shareConfig.singleton = singleton;
			if (isValidValue(requiredVersion)) shareConfig.requiredVersion = requiredVersion;
			if (isValidValue(eager)) shareConfig.eager = eager;
			if (isValidValue(strictVersion)) shareConfig.strictVersion = strictVersion;
			const options = {
				version,
				scope: [scope],
				shareConfig,
				get: factory
			};
			if (shared[name]) shared[name].push(options);
			else shared[name] = [options];
		}
		federation.instance.registerShared(shared);
		initializeSharingData._updated = 1;
	}
}
function updateRemoteOptions(options) {
	const { webpackRequire, idToExternalAndNameMapping = {}, idToRemoteMap = {}, chunkMapping = {} } = options;
	const { remotesLoadingData } = webpackRequire;
	const remoteInfos = webpackRequire.federation?.bundlerRuntimeOptions?.remotes?.remoteInfos;
	if (!remotesLoadingData || remotesLoadingData._updated || !remoteInfos) return;
	const { chunkMapping: updatedChunkMapping, moduleIdToRemoteDataMapping } = remotesLoadingData;
	if (!updatedChunkMapping || !moduleIdToRemoteDataMapping) return;
	for (let [moduleId, data] of Object.entries(moduleIdToRemoteDataMapping)) {
		if (!idToExternalAndNameMapping[moduleId]) idToExternalAndNameMapping[moduleId] = [
			data.shareScope,
			data.name,
			data.externalModuleId
		];
		if (!idToRemoteMap[moduleId] && remoteInfos[data.remoteName]) {
			const items = remoteInfos[data.remoteName];
			idToRemoteMap[moduleId] ||= [];
			items.forEach((item) => {
				if (!idToRemoteMap[moduleId].includes(item)) idToRemoteMap[moduleId].push(item);
			});
		}
	}
	if (chunkMapping) Object.entries(updatedChunkMapping).forEach(([id, chunkModules]) => {
		if (!chunkMapping[id]) chunkMapping[id] = [];
		chunkModules.forEach((moduleId) => {
			if (!chunkMapping[id].includes(moduleId)) chunkMapping[id].push(moduleId);
		});
	});
	remotesLoadingData._updated = 1;
}

//#endregion


;// ../node_modules/@module-federation/sdk/dist/constant.js
//#region src/constant.ts
const FederationModuleManifest = "federation-manifest.json";
const MANIFEST_EXT = ".json";
const BROWSER_LOG_KEY = "FEDERATION_DEBUG";
const NameTransformSymbol = {
	AT: "@",
	HYPHEN: "-",
	SLASH: "/"
};
const NameTransformMap = {
	[NameTransformSymbol.AT]: "scope_",
	[NameTransformSymbol.HYPHEN]: "_",
	[NameTransformSymbol.SLASH]: "__"
};
const EncodedNameTransformMap = {
	[NameTransformMap[NameTransformSymbol.AT]]: NameTransformSymbol.AT,
	[NameTransformMap[NameTransformSymbol.HYPHEN]]: NameTransformSymbol.HYPHEN,
	[NameTransformMap[NameTransformSymbol.SLASH]]: NameTransformSymbol.SLASH
};
const SEPARATOR = ":";
const ManifestFileName = "mf-manifest.json";
const StatsFileName = "mf-stats.json";
const MFModuleType = {
	NPM: "npm",
	APP: "app"
};
const MODULE_DEVTOOL_IDENTIFIER = "__MF_DEVTOOLS_MODULE_INFO__";
const ENCODE_NAME_PREFIX = "ENCODE_NAME_PREFIX";
const TEMP_DIR = ".federation";
const MFPrefetchCommon = {
	identifier: "MFDataPrefetch",
	globalKey: "__PREFETCH__",
	library: "mf-data-prefetch",
	exportsKey: "__PREFETCH_EXPORTS__",
	fileName: "bootstrap.js"
};
let TreeShakingStatus = /* @__PURE__ */ function(TreeShakingStatus) {
	/**
	* Not handled by deploy server, needs to infer by the real runtime period.
	*/
	TreeShakingStatus[TreeShakingStatus["UNKNOWN"] = 1] = "UNKNOWN";
	/**
	* It means the shared has been calculated , runtime should take this shared as first choice.
	*/
	TreeShakingStatus[TreeShakingStatus["CALCULATED"] = 2] = "CALCULATED";
	/**
	* It means the shared has been calculated, and marked as no used
	*/
	TreeShakingStatus[TreeShakingStatus["NO_USE"] = 0] = "NO_USE";
	return TreeShakingStatus;
}({});

//#endregion


;// ../node_modules/@module-federation/sdk/dist/env.js


//#region src/env.ts
const isBrowserEnvValue = typeof ENV_TARGET !== "undefined" ? ENV_TARGET === "web" : typeof window !== "undefined" && typeof window.document !== "undefined";
function isBrowserEnv() {
	return isBrowserEnvValue;
}
function isReactNativeEnv() {
	return typeof navigator !== "undefined" && navigator?.product === "ReactNative";
}
function isBrowserDebug() {
	try {
		if (isBrowserEnv() && window.localStorage) return Boolean(localStorage.getItem(BROWSER_LOG_KEY));
	} catch (error) {
		return false;
	}
	return false;
}
function isDebugMode() {
	if (typeof process !== "undefined" && process.env && process.env["FEDERATION_DEBUG"]) return Boolean(process.env["FEDERATION_DEBUG"]);
	if (typeof FEDERATION_DEBUG !== "undefined" && Boolean(FEDERATION_DEBUG)) return true;
	return isBrowserDebug();
}
const getProcessEnv = function() {
	return typeof process !== "undefined" && process.env ? process.env : {};
};

//#endregion


;// ../node_modules/@module-federation/sdk/dist/utils.js



//#region src/utils.ts
const LOG_CATEGORY = "[ Federation Runtime ]";
const parseEntry = (str, devVerOrUrl, separator = SEPARATOR) => {
	const strSplit = str.split(separator);
	const devVersionOrUrl = getProcessEnv()["NODE_ENV"] === "development" && devVerOrUrl;
	const defaultVersion = "*";
	const isEntry = (s) => s.startsWith("http") || s.includes(MANIFEST_EXT);
	if (strSplit.length >= 2) {
		let [name, ...versionOrEntryArr] = strSplit;
		if (str.startsWith(separator)) {
			name = strSplit.slice(0, 2).join(separator);
			versionOrEntryArr = [devVersionOrUrl || strSplit.slice(2).join(separator)];
		}
		let versionOrEntry = devVersionOrUrl || versionOrEntryArr.join(separator);
		if (isEntry(versionOrEntry)) return {
			name,
			entry: versionOrEntry
		};
		else return {
			name,
			version: versionOrEntry || defaultVersion
		};
	} else if (strSplit.length === 1) {
		const [name] = strSplit;
		if (devVersionOrUrl && isEntry(devVersionOrUrl)) return {
			name,
			entry: devVersionOrUrl
		};
		return {
			name,
			version: devVersionOrUrl || defaultVersion
		};
	} else throw `Invalid entry value: ${str}`;
};
const composeKeyWithSeparator = function(...args) {
	if (!args.length) return "";
	return args.reduce((sum, cur) => {
		if (!cur) return sum;
		if (!sum) return cur;
		return `${sum}${SEPARATOR}${cur}`;
	}, "");
};
const encodeName = function(name, prefix = "", withExt = false) {
	try {
		const ext = withExt ? ".js" : "";
		return `${prefix}${name.replace(new RegExp(`${NameTransformSymbol.AT}`, "g"), NameTransformMap[NameTransformSymbol.AT]).replace(new RegExp(`${NameTransformSymbol.HYPHEN}`, "g"), NameTransformMap[NameTransformSymbol.HYPHEN]).replace(new RegExp(`${NameTransformSymbol.SLASH}`, "g"), NameTransformMap[NameTransformSymbol.SLASH])}${ext}`;
	} catch (err) {
		throw err;
	}
};
const decodeName = function(name, prefix, withExt) {
	try {
		let decodedName = name;
		if (prefix) {
			if (!decodedName.startsWith(prefix)) return decodedName;
			decodedName = decodedName.replace(new RegExp(prefix, "g"), "");
		}
		decodedName = decodedName.replace(new RegExp(`${NameTransformMap[NameTransformSymbol.AT]}`, "g"), EncodedNameTransformMap[NameTransformMap[NameTransformSymbol.AT]]).replace(new RegExp(`${NameTransformMap[NameTransformSymbol.SLASH]}`, "g"), EncodedNameTransformMap[NameTransformMap[NameTransformSymbol.SLASH]]).replace(new RegExp(`${NameTransformMap[NameTransformSymbol.HYPHEN]}`, "g"), EncodedNameTransformMap[NameTransformMap[NameTransformSymbol.HYPHEN]]);
		if (withExt) decodedName = decodedName.replace(".js", "");
		return decodedName;
	} catch (err) {
		throw err;
	}
};
const generateExposeFilename = (exposeName, withExt) => {
	if (!exposeName) return "";
	let expose = exposeName;
	if (expose === ".") expose = "default_export";
	if (expose.startsWith("./")) expose = expose.replace("./", "");
	return encodeName(expose, "__federation_expose_", withExt);
};
const generateShareFilename = (pkgName, withExt) => {
	if (!pkgName) return "";
	return encodeName(pkgName, "__federation_shared_", withExt);
};
const getResourceUrl = (module, sourceUrl) => {
	if ("getPublicPath" in module) {
		let publicPath;
		if (!module.getPublicPath.startsWith("function")) publicPath = new Function(module.getPublicPath)();
		else publicPath = new Function("return " + module.getPublicPath)()();
		return `${publicPath}${sourceUrl}`;
	} else if ("publicPath" in module) {
		if (!isBrowserEnv() && !isReactNativeEnv() && "ssrPublicPath" in module && typeof module.ssrPublicPath === "string") return `${module.ssrPublicPath}${sourceUrl}`;
		return `${module.publicPath}${sourceUrl}`;
	} else {
		console.warn("Cannot get resource URL. If in debug mode, please ignore.", module, sourceUrl);
		return "";
	}
};
const assert = (condition, msg) => {
	if (!condition) error(msg);
};
const error = (msg) => {
	throw new Error(`${LOG_CATEGORY}: ${msg}`);
};
const warn = (msg) => {
	console.warn(`${LOG_CATEGORY}: ${msg}`);
};
function safeToString(info) {
	try {
		return JSON.stringify(info, null, 2);
	} catch (e) {
		return "";
	}
}
const VERSION_PATTERN_REGEXP = /^([\d^=v<>~]|[*xX]$)/;
function isRequiredVersion(str) {
	return VERSION_PATTERN_REGEXP.test(str);
}

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/remotes.js





//#region src/remotes.ts
function remotes(options) {
	updateRemoteOptions(options);
	const { chunkId, promises, webpackRequire, chunkMapping, idToExternalAndNameMapping, idToRemoteMap } = options;
	attachShareScopeMap(webpackRequire);
	if (webpackRequire.o(chunkMapping, chunkId)) chunkMapping[chunkId].forEach((id) => {
		let getScope = webpackRequire.R;
		if (!getScope) getScope = [];
		const data = idToExternalAndNameMapping[id];
		const remoteInfos = idToRemoteMap[id] || [];
		if (getScope.indexOf(data) >= 0) return;
		getScope.push(data);
		if (data.p) return promises.push(data.p);
		const onError = (error) => {
			if (!error) error = /* @__PURE__ */ new Error("Container missing");
			if (typeof error.message === "string") error.message += `\nwhile loading "${data[1]}" from ${data[2]}`;
			webpackRequire.m[id] = () => {
				throw error;
			};
			data.p = 0;
		};
		const handleFunction = (fn, arg1, arg2, d, next, first) => {
			try {
				const promise = fn(arg1, arg2);
				if (promise && promise.then) {
					const p = promise.then((result) => next(result, d), onError);
					if (first) promises.push(data.p = p);
					else return p;
				} else return next(promise, d, first);
			} catch (error) {
				onError(error);
			}
		};
		const onExternal = (external, _, first) => external ? handleFunction(webpackRequire.I, data[0], 0, external, onInitialized, first) : onError();
		var onInitialized = (_, external, first) => handleFunction(external.get, data[1], getScope, 0, onFactory, first);
		var onFactory = (factory) => {
			data.p = 1;
			webpackRequire.m[id] = (module) => {
				module.exports = factory();
			};
		};
		const onRemoteLoaded = () => {
			try {
				const remoteModuleName = decodeName(remoteInfos[0].name, ENCODE_NAME_PREFIX) + data[1].slice(1);
				const instance = webpackRequire.federation.instance;
				const loadRemote = () => webpackRequire.federation.instance.loadRemote(remoteModuleName, {
					loadFactory: false,
					from: "build"
				});
				if (instance.options.shareStrategy === "version-first") {
					const shareScopes = Array.isArray(data[0]) ? data[0] : [data[0]];
					return Promise.all(shareScopes.map((shareScope) => instance.sharedHandler.initializeSharing(shareScope))).then(() => {
						return loadRemote();
					});
				}
				return loadRemote();
			} catch (error) {
				onError(error);
			}
		};
		if (remoteInfos.length === 1 && FEDERATION_SUPPORTED_TYPES.includes(remoteInfos[0].externalType) && remoteInfos[0].name) handleFunction(onRemoteLoaded, data[2], 0, 0, onFactory, 1);
		else handleFunction(webpackRequire, data[2], 0, 0, onExternal, 1);
	});
}

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/getUsedExports.js
//#region src/getUsedExports.ts
function getUsedExports(webpackRequire, sharedName) {
	const usedExports = webpackRequire.federation.usedExports;
	if (!usedExports) return;
	return usedExports[sharedName];
}

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/error-codes/dist/error-codes.js
//#region ../error-codes/dist/error-codes.mjs
const RUNTIME_012 = "RUNTIME-012";

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/error-codes/dist/getShortErrorMsg.js
//#region ../error-codes/dist/getShortErrorMsg.mjs
const getDocsUrl = (errorCode) => {
	return `View the docs to see how to solve: https://module-federation.io/guide/troubleshooting/${errorCode.split("-")[0].toLowerCase()}#${errorCode.toLowerCase()}`;
};
const getShortErrorMsg = (errorCode, errorDescMap, args, originalErrorMsg) => {
	const msg = [`${[errorDescMap[errorCode]]} #${errorCode}`];
	args && msg.push(`args: ${JSON.stringify(args)}`);
	msg.push(getDocsUrl(errorCode));
	originalErrorMsg && msg.push(`Original Error Message:\n ${originalErrorMsg}`);
	return msg.join("\n");
};

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/consumes.js






//#region src/consumes.ts
function consumes(options) {
	updateConsumeOptions(options);
	const { chunkId, promises, installedModules, webpackRequire, chunkMapping, moduleToHandlerMapping } = options;
	attachShareScopeMap(webpackRequire);
	if (webpackRequire.o(chunkMapping, chunkId)) chunkMapping[chunkId].forEach((id) => {
		if (webpackRequire.o(installedModules, id)) return promises.push(installedModules[id]);
		const onFactory = (factory) => {
			installedModules[id] = 0;
			webpackRequire.m[id] = (module) => {
				delete webpackRequire.c[id];
				const result = factory();
				const { shareInfo } = moduleToHandlerMapping[id];
				if (shareInfo?.shareConfig?.layer && result && typeof result === "object") try {
					if (!result.hasOwnProperty("layer") || result.layer === void 0) result.layer = shareInfo.shareConfig.layer;
				} catch (e) {}
				module.exports = result;
			};
		};
		const onError = (error) => {
			delete installedModules[id];
			webpackRequire.m[id] = (module) => {
				delete webpackRequire.c[id];
				throw error;
			};
		};
		try {
			const federationInstance = webpackRequire.federation.instance;
			if (!federationInstance) throw new Error("Federation instance not found!");
			const { shareKey, getter, shareInfo, treeShakingGetter } = moduleToHandlerMapping[id];
			const usedExports = getUsedExports(webpackRequire, shareKey);
			const customShareInfo = { ...shareInfo };
			if (Array.isArray(customShareInfo.scope) && Array.isArray(customShareInfo.scope[0])) customShareInfo.scope = customShareInfo.scope[0];
			if (usedExports) customShareInfo.treeShaking = {
				usedExports,
				useIn: [federationInstance.options.name]
			};
			const promise = federationInstance.loadShare(shareKey, { customShareInfo }).then((factory) => {
				if (factory === false) {
					if (typeof getter !== "function") throw new Error(getShortErrorMsg(RUNTIME_012, { [RUNTIME_012]: "The getter for the shared module is not a function. This may be caused by setting \"shared.import: false\" without the host providing the corresponding lib." }, { shareKey }));
					return treeShakingGetter?.() || getter();
				}
				return factory;
			});
			if (promise.then) promises.push(installedModules[id] = promise.then(onFactory).catch(onError));
			else onFactory(promise);
		} catch (e) {
			onError(e);
		}
	});
}

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/initializeSharing.js



//#region src/initializeSharing.ts
function initializeSharing({ shareScopeName, webpackRequire, initPromises, initTokens, initScope }) {
	const shareScopeKeys = Array.isArray(shareScopeName) ? shareScopeName : [shareScopeName];
	var initializeSharingPromises = [];
	var _initializeSharing = function(shareScopeKey) {
		if (!initScope) initScope = [];
		const mfInstance = webpackRequire.federation.instance;
		var initToken = initTokens[shareScopeKey];
		if (!initToken) initToken = initTokens[shareScopeKey] = { from: mfInstance.name };
		if (initScope.indexOf(initToken) >= 0) return;
		initScope.push(initToken);
		const promise = initPromises[shareScopeKey];
		if (promise) return promise;
		var warn = (msg) => typeof console !== "undefined" && console.warn && console.warn(msg);
		var initExternal = (id) => {
			var handleError = (err) => warn("Initialization of sharing external failed: " + err);
			try {
				var module = webpackRequire(id);
				if (!module) return;
				var initFn = (module) => module && module.init && module.init(webpackRequire.S[shareScopeKey], initScope, {
					shareScopeMap: webpackRequire.S || {},
					shareScopeKeys: shareScopeName
				});
				if (module.then) return promises.push(module.then(initFn, handleError));
				var initResult = initFn(module);
				if (initResult && typeof initResult !== "boolean" && initResult.then) return promises.push(initResult["catch"](handleError));
			} catch (err) {
				handleError(err);
			}
		};
		const promises = mfInstance.initializeSharing(shareScopeKey, {
			strategy: mfInstance.options.shareStrategy,
			initScope,
			from: "build"
		});
		attachShareScopeMap(webpackRequire);
		const bundlerRuntimeRemotesOptions = webpackRequire.federation.bundlerRuntimeOptions.remotes;
		if (bundlerRuntimeRemotesOptions) Object.keys(bundlerRuntimeRemotesOptions.idToRemoteMap).forEach((moduleId) => {
			const info = bundlerRuntimeRemotesOptions.idToRemoteMap[moduleId];
			const externalModuleId = bundlerRuntimeRemotesOptions.idToExternalAndNameMapping[moduleId][2];
			if (info.length > 1) initExternal(externalModuleId);
			else if (info.length === 1) {
				const remoteInfo = info[0];
				if (!FEDERATION_SUPPORTED_TYPES.includes(remoteInfo.externalType)) initExternal(externalModuleId);
			}
		});
		if (!promises.length) return initPromises[shareScopeKey] = true;
		return initPromises[shareScopeKey] = Promise.all(promises).then(() => initPromises[shareScopeKey] = true);
	};
	shareScopeKeys.forEach((key) => {
		initializeSharingPromises.push(_initializeSharing(key));
	});
	return Promise.all(initializeSharingPromises).then(() => true);
}

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/installInitialConsumes.js



//#region src/installInitialConsumes.ts
function handleInitialConsumes(options) {
	const { moduleId, moduleToHandlerMapping, webpackRequire, asyncLoad } = options;
	const federationInstance = webpackRequire.federation.instance;
	if (!federationInstance) throw new Error("Federation instance not found!");
	const { shareKey, shareInfo } = moduleToHandlerMapping[moduleId];
	try {
		const usedExports = getUsedExports(webpackRequire, shareKey);
		const customShareInfo = { ...shareInfo };
		if (usedExports) customShareInfo.treeShaking = {
			usedExports,
			useIn: [federationInstance.options.name]
		};
		if (asyncLoad) return federationInstance.loadShare(shareKey, { customShareInfo });
		return federationInstance.loadShareSync(shareKey, { customShareInfo });
	} catch (err) {
		console.error("loadShareSync failed! The function should not be called unless you set \"eager:true\". If you do not set it, and encounter this issue, you can check whether an async boundary is implemented.");
		console.error("The original error message is as follows: ");
		throw err;
	}
}
function installInitialConsumes(options) {
	updateConsumeOptions(options);
	const { moduleToHandlerMapping, webpackRequire, installedModules, initialConsumes, asyncLoad } = options;
	const factoryIdSets = [];
	initialConsumes.forEach((id) => {
		const factoryGetter = () => handleInitialConsumes({
			moduleId: id,
			moduleToHandlerMapping,
			webpackRequire,
			asyncLoad
		});
		factoryIdSets.push([id, factoryGetter]);
	});
	const setModule = (id, factoryGetter) => {
		webpackRequire.m[id] = (module) => {
			installedModules[id] = 0;
			delete webpackRequire.c[id];
			const factory = factoryGetter();
			if (typeof factory !== "function") throw new Error(`Shared module is not available for eager consumption: ${id}`);
			const result = factory();
			const { shareInfo } = moduleToHandlerMapping[id];
			if (shareInfo?.shareConfig?.layer && result && typeof result === "object") try {
				if (!result.hasOwnProperty("layer") || result.layer === void 0) result.layer = shareInfo.shareConfig.layer;
			} catch (e) {}
			module.exports = result;
		};
	};
	if (asyncLoad) return Promise.all(factoryIdSets.map(async ([id, factoryGetter]) => {
		const result = await factoryGetter();
		setModule(id, () => result);
	}));
	factoryIdSets.forEach(([id, factoryGetter]) => {
		setModule(id, factoryGetter);
	});
}

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/initContainerEntry.js
//#region src/initContainerEntry.ts
function initContainerEntry(options) {
	const { webpackRequire, shareScope, initScope, shareScopeKey, remoteEntryInitOptions } = options;
	if (!webpackRequire.S) return;
	if (!webpackRequire.federation || !webpackRequire.federation.instance || !webpackRequire.federation.initOptions) return;
	const federationInstance = webpackRequire.federation.instance;
	federationInstance.initOptions({
		name: webpackRequire.federation.initOptions.name,
		remotes: [],
		...remoteEntryInitOptions
	});
	const hostShareScopeKeys = remoteEntryInitOptions?.shareScopeKeys;
	const hostShareScopeMap = remoteEntryInitOptions?.shareScopeMap;
	if (!shareScopeKey || typeof shareScopeKey === "string") {
		const key = shareScopeKey || "default";
		if (Array.isArray(hostShareScopeKeys)) hostShareScopeKeys.forEach((hostKey) => {
			if (!hostShareScopeMap[hostKey]) hostShareScopeMap[hostKey] = {};
			const sc = hostShareScopeMap[hostKey];
			federationInstance.initShareScopeMap(hostKey, sc, { hostShareScopeMap: remoteEntryInitOptions?.shareScopeMap || {} });
		});
		else federationInstance.initShareScopeMap(key, shareScope, { hostShareScopeMap: remoteEntryInitOptions?.shareScopeMap || {} });
	} else shareScopeKey.forEach((key) => {
		if (!hostShareScopeKeys || !hostShareScopeMap) {
			federationInstance.initShareScopeMap(key, shareScope, { hostShareScopeMap: remoteEntryInitOptions?.shareScopeMap || {} });
			return;
		}
		if (!hostShareScopeMap[key]) hostShareScopeMap[key] = {};
		const sc = hostShareScopeMap[key];
		federationInstance.initShareScopeMap(key, sc, { hostShareScopeMap: remoteEntryInitOptions?.shareScopeMap || {} });
	});
	if (webpackRequire.federation.attachShareScopeMap) webpackRequire.federation.attachShareScopeMap(webpackRequire);
	if (typeof webpackRequire.federation.prefetch === "function") webpackRequire.federation.prefetch();
	if (!Array.isArray(shareScopeKey)) return webpackRequire.I(shareScopeKey || "default", initScope);
	if (Boolean(webpackRequire.federation.initOptions.shared)) return webpackRequire.I(shareScopeKey, initScope);
	return Promise.all(shareScopeKey.map((key) => {
		return webpackRequire.I(key, initScope);
	})).then(() => true);
}

//#endregion


;// ../node_modules/@module-federation/sdk/dist/logger.js


//#region src/logger.ts
const PREFIX = "[ Module Federation ]";
const DEFAULT_DELEGATE = console;
const LOGGER_STACK_SKIP_TOKENS = [
	"logger.ts",
	"logger.js",
	"captureStackTrace",
	"Logger.emit",
	"Logger.log",
	"Logger.info",
	"Logger.warn",
	"Logger.error",
	"Logger.debug"
];
function captureStackTrace() {
	try {
		const stack = (/* @__PURE__ */ new Error()).stack;
		if (!stack) return;
		const [, ...rawLines] = stack.split("\n");
		const filtered = rawLines.filter((line) => !LOGGER_STACK_SKIP_TOKENS.some((token) => line.includes(token)));
		if (!filtered.length) return;
		return `Stack trace:\n${filtered.slice(0, 5).join("\n")}`;
	} catch {
		return;
	}
}
var Logger = class {
	constructor(prefix, delegate = DEFAULT_DELEGATE) {
		this.prefix = prefix;
		this.delegate = delegate ?? DEFAULT_DELEGATE;
	}
	setPrefix(prefix) {
		this.prefix = prefix;
	}
	setDelegate(delegate) {
		this.delegate = delegate ?? DEFAULT_DELEGATE;
	}
	emit(method, args) {
		const delegate = this.delegate;
		const stackTrace = isDebugMode() ? captureStackTrace() : void 0;
		const enrichedArgs = stackTrace ? [...args, stackTrace] : args;
		const order = (() => {
			switch (method) {
				case "log": return ["log", "info"];
				case "info": return ["info", "log"];
				case "warn": return [
					"warn",
					"info",
					"log"
				];
				case "error": return [
					"error",
					"warn",
					"log"
				];
				default: return ["debug", "log"];
			}
		})();
		for (const candidate of order) {
			const handler = delegate[candidate];
			if (typeof handler === "function") {
				handler.call(delegate, this.prefix, ...enrichedArgs);
				return;
			}
		}
		for (const candidate of order) {
			const handler = DEFAULT_DELEGATE[candidate];
			if (typeof handler === "function") {
				handler.call(DEFAULT_DELEGATE, this.prefix, ...enrichedArgs);
				return;
			}
		}
	}
	log(...args) {
		this.emit("log", args);
	}
	warn(...args) {
		this.emit("warn", args);
	}
	error(...args) {
		this.emit("error", args);
	}
	success(...args) {
		this.emit("info", args);
	}
	info(...args) {
		this.emit("info", args);
	}
	ready(...args) {
		this.emit("info", args);
	}
	debug(...args) {
		if (isDebugMode()) this.emit("debug", args);
	}
};
function createLogger(prefix) {
	return new Logger(prefix);
}
function createInfrastructureLogger(prefix) {
	const infrastructureLogger = new Logger(prefix);
	Object.defineProperty(infrastructureLogger, "__mf_infrastructure_logger__", {
		value: true,
		enumerable: false,
		configurable: false
	});
	return infrastructureLogger;
}
function bindLoggerToCompiler(loggerInstance, compiler, name) {
	if (!loggerInstance.__mf_infrastructure_logger__) return;
	if (!compiler?.getInfrastructureLogger) return;
	try {
		const infrastructureLogger = compiler.getInfrastructureLogger(name);
		if (infrastructureLogger && typeof infrastructureLogger === "object" && (typeof infrastructureLogger.log === "function" || typeof infrastructureLogger.info === "function" || typeof infrastructureLogger.warn === "function" || typeof infrastructureLogger.error === "function")) loggerInstance.setDelegate(infrastructureLogger);
	} catch {
		loggerInstance.setDelegate(void 0);
	}
}
const logger = createLogger(PREFIX);
const infrastructureLogger = createInfrastructureLogger(PREFIX);

//#endregion


;// ../node_modules/@module-federation/error-codes/dist/getShortErrorMsg.mjs
//#region src/getShortErrorMsg.ts
const getShortErrorMsg_getDocsUrl = (errorCode) => {
	return `View the docs to see how to solve: https://module-federation.io/guide/troubleshooting/${errorCode.split("-")[0].toLowerCase()}#${errorCode.toLowerCase()}`;
};
const getShortErrorMsg_getShortErrorMsg = (errorCode, errorDescMap, args, originalErrorMsg) => {
	const msg = [`${[errorDescMap[errorCode]]} #${errorCode}`];
	args && msg.push(`args: ${JSON.stringify(args)}`);
	msg.push(getShortErrorMsg_getDocsUrl(errorCode));
	originalErrorMsg && msg.push(`Original Error Message:\n ${originalErrorMsg}`);
	return msg.join("\n");
};

//#endregion

//# sourceMappingURL=getShortErrorMsg.mjs.map
;// ../node_modules/@module-federation/error-codes/dist/browser.mjs


//#region src/browser.ts
function logAndReport(code, descMap, args, logger, originalErrorMsg, context) {
	return logger(getShortErrorMsg_getShortErrorMsg(code, descMap, args, originalErrorMsg));
}

//#endregion

//# sourceMappingURL=browser.mjs.map
;// ../node_modules/@module-federation/runtime-core/dist/utils/logger.js



//#region src/utils/logger.ts
const logger_LOG_CATEGORY = "[ Federation Runtime ]";
const logger_logger = createLogger(logger_LOG_CATEGORY);
function logger_assert(condition, msgOrCode, descMap, args, context) {
	if (!condition) if (descMap !== void 0) logger_error(msgOrCode, descMap, args, void 0, context);
	else logger_error(msgOrCode);
}
function logger_error(msgOrCode, descMap, args, originalErrorMsg, context) {
	if (descMap !== void 0) return logAndReport(msgOrCode, descMap, args ?? {}, (msg) => {
		throw new Error(`${logger_LOG_CATEGORY}: ${msg}`);
	}, originalErrorMsg, context);
	const msg = msgOrCode;
	if (msg instanceof Error) {
		if (!msg.message.startsWith(logger_LOG_CATEGORY)) msg.message = `${logger_LOG_CATEGORY}: ${msg.message}`;
		throw msg;
	}
	throw new Error(`${logger_LOG_CATEGORY}: ${msg}`);
}
function warn$1(msg) {
	if (msg instanceof Error) {
		if (!msg.message.startsWith(logger_LOG_CATEGORY)) msg.message = `${logger_LOG_CATEGORY}: ${msg.message}`;
		logger_logger.warn(msg);
	} else logger_logger.warn(msg);
}

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/tool.js



//#region src/utils/tool.ts
function addUniqueItem(arr, item) {
	if (arr.findIndex((name) => name === item) === -1) arr.push(item);
	return arr;
}
function getFMId(remoteInfo) {
	if ("version" in remoteInfo && remoteInfo.version) return `${remoteInfo.name}:${remoteInfo.version}`;
	else if ("entry" in remoteInfo && remoteInfo.entry) return `${remoteInfo.name}:${remoteInfo.entry}`;
	else return `${remoteInfo.name}`;
}
function isRemoteInfoWithEntry(remote) {
	return typeof remote.entry !== "undefined";
}
function isPureRemoteEntry(remote) {
	return !remote.entry.includes(".json");
}
async function safeWrapper(callback, disableWarn) {
	try {
		return await callback();
	} catch (e) {
		!disableWarn && warn$1(e);
		return;
	}
}
function isObject(val) {
	return val && typeof val === "object";
}
const objectToString = Object.prototype.toString;
function isPlainObject(val) {
	return objectToString.call(val) === "[object Object]";
}
function isStaticResourcesEqual(url1, url2) {
	const REG_EXP = /^(https?:)?\/\//i;
	return url1.replace(REG_EXP, "").replace(/\/$/, "") === url2.replace(REG_EXP, "").replace(/\/$/, "");
}
function arrayOptions(options) {
	return Array.isArray(options) ? options : [options];
}
function getRemoteEntryInfoFromSnapshot(snapshot) {
	const defaultRemoteEntryInfo = {
		url: "",
		type: "global",
		globalName: ""
	};
	if (isBrowserEnvValue || isReactNativeEnv() || !("ssrRemoteEntry" in snapshot)) return "remoteEntry" in snapshot ? {
		url: snapshot.remoteEntry,
		type: snapshot.remoteEntryType,
		globalName: snapshot.globalName
	} : defaultRemoteEntryInfo;
	if ("ssrRemoteEntry" in snapshot) return {
		url: snapshot.ssrRemoteEntry || defaultRemoteEntryInfo.url,
		type: snapshot.ssrRemoteEntryType || defaultRemoteEntryInfo.type,
		globalName: snapshot.globalName
	};
	return defaultRemoteEntryInfo;
}
const processModuleAlias = (name, subPath) => {
	let moduleName;
	if (name.endsWith("/")) moduleName = name.slice(0, -1);
	else moduleName = name;
	if (subPath.startsWith(".")) subPath = subPath.slice(1);
	moduleName = moduleName + subPath;
	return moduleName;
};

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/global.js




//#region src/global.ts
const CurrentGlobal = typeof globalThis === "object" ? globalThis : window;
const nativeGlobal = (() => {
	try {
		return document.defaultView;
	} catch {
		return CurrentGlobal;
	}
})();
const Global = nativeGlobal;
function definePropertyGlobalVal(target, key, val) {
	Object.defineProperty(target, key, {
		value: val,
		configurable: false,
		writable: true
	});
}
function includeOwnProperty(target, key) {
	return Object.hasOwnProperty.call(target, key);
}
if (!includeOwnProperty(CurrentGlobal, "__GLOBAL_LOADING_REMOTE_ENTRY__")) definePropertyGlobalVal(CurrentGlobal, "__GLOBAL_LOADING_REMOTE_ENTRY__", {});
const globalLoading = CurrentGlobal.__GLOBAL_LOADING_REMOTE_ENTRY__;
function setGlobalDefaultVal(target) {
	if (includeOwnProperty(target, "__VMOK__") && !includeOwnProperty(target, "__FEDERATION__")) definePropertyGlobalVal(target, "__FEDERATION__", target.__VMOK__);
	if (!includeOwnProperty(target, "__FEDERATION__")) {
		definePropertyGlobalVal(target, "__FEDERATION__", {
			__GLOBAL_PLUGIN__: [],
			__INSTANCES__: [],
			moduleInfo: {},
			__SHARE__: {},
			__MANIFEST_LOADING__: {},
			__PRELOADED_MAP__: /* @__PURE__ */ new Map()
		});
		definePropertyGlobalVal(target, "__VMOK__", target.__FEDERATION__);
	}
	target.__FEDERATION__.__GLOBAL_PLUGIN__ ??= [];
	target.__FEDERATION__.__INSTANCES__ ??= [];
	target.__FEDERATION__.moduleInfo ??= {};
	target.__FEDERATION__.__SHARE__ ??= {};
	target.__FEDERATION__.__MANIFEST_LOADING__ ??= {};
	target.__FEDERATION__.__PRELOADED_MAP__ ??= /* @__PURE__ */ new Map();
}
setGlobalDefaultVal(CurrentGlobal);
setGlobalDefaultVal(nativeGlobal);
function resetFederationGlobalInfo() {
	CurrentGlobal.__FEDERATION__.__GLOBAL_PLUGIN__ = [];
	CurrentGlobal.__FEDERATION__.__INSTANCES__ = [];
	CurrentGlobal.__FEDERATION__.moduleInfo = {};
	CurrentGlobal.__FEDERATION__.__SHARE__ = {};
	CurrentGlobal.__FEDERATION__.__MANIFEST_LOADING__ = {};
	Object.keys(globalLoading).forEach((key) => {
		delete globalLoading[key];
	});
}
function setGlobalFederationInstance(FederationInstance) {
	CurrentGlobal.__FEDERATION__.__INSTANCES__.push(FederationInstance);
}
function getGlobalFederationConstructor() {
	return CurrentGlobal.__FEDERATION__.__DEBUG_CONSTRUCTOR__;
}
function setGlobalFederationConstructor(FederationConstructor, isDebug = isDebugMode()) {
	if (isDebug) {
		CurrentGlobal.__FEDERATION__.__DEBUG_CONSTRUCTOR__ = FederationConstructor;
		CurrentGlobal.__FEDERATION__.__DEBUG_CONSTRUCTOR_VERSION__ = "2.3.3";
	}
}
function getInfoWithoutType(target, key) {
	if (typeof key === "string") if (target[key]) return {
		value: target[key],
		key
	};
	else {
		const targetKeys = Object.keys(target);
		for (const targetKey of targetKeys) {
			const [targetTypeOrName, _] = targetKey.split(":");
			const nKey = `${targetTypeOrName}:${key}`;
			const typeWithKeyRes = target[nKey];
			if (typeWithKeyRes) return {
				value: typeWithKeyRes,
				key: nKey
			};
		}
		return {
			value: void 0,
			key
		};
	}
	else logger_error(`getInfoWithoutType: "key" must be a string, got ${typeof key} (${JSON.stringify(key)}).`);
}
const getGlobalSnapshot = () => nativeGlobal.__FEDERATION__.moduleInfo;
const getTargetSnapshotInfoByModuleInfo = (moduleInfo, snapshot) => {
	const getModuleInfo = getInfoWithoutType(snapshot, getFMId(moduleInfo)).value;
	if (getModuleInfo && !getModuleInfo.version && "version" in moduleInfo && moduleInfo["version"]) getModuleInfo.version = moduleInfo["version"];
	if (getModuleInfo) return getModuleInfo;
	if ("version" in moduleInfo && moduleInfo["version"]) {
		const { version, ...resModuleInfo } = moduleInfo;
		const moduleKeyWithoutVersion = getFMId(resModuleInfo);
		const getModuleInfoWithoutVersion = getInfoWithoutType(nativeGlobal.__FEDERATION__.moduleInfo, moduleKeyWithoutVersion).value;
		if (getModuleInfoWithoutVersion?.version === version) return getModuleInfoWithoutVersion;
	}
};
const getGlobalSnapshotInfoByModuleInfo = (moduleInfo) => getTargetSnapshotInfoByModuleInfo(moduleInfo, nativeGlobal.__FEDERATION__.moduleInfo);
const setGlobalSnapshotInfoByModuleInfo = (remoteInfo, moduleDetailInfo) => {
	const moduleKey = getFMId(remoteInfo);
	nativeGlobal.__FEDERATION__.moduleInfo[moduleKey] = moduleDetailInfo;
	return nativeGlobal.__FEDERATION__.moduleInfo;
};
const addGlobalSnapshot = (moduleInfos) => {
	nativeGlobal.__FEDERATION__.moduleInfo = {
		...nativeGlobal.__FEDERATION__.moduleInfo,
		...moduleInfos
	};
	return () => {
		const keys = Object.keys(moduleInfos);
		for (const key of keys) delete nativeGlobal.__FEDERATION__.moduleInfo[key];
	};
};
const getRemoteEntryExports = (name, globalName) => {
	const remoteEntryKey = globalName || `__FEDERATION_${name}:custom__`;
	return {
		remoteEntryKey,
		entryExports: CurrentGlobal[remoteEntryKey]
	};
};
const registerGlobalPlugins = (plugins) => {
	const { __GLOBAL_PLUGIN__ } = nativeGlobal.__FEDERATION__;
	plugins.forEach((plugin) => {
		if (__GLOBAL_PLUGIN__.findIndex((p) => p.name === plugin.name) === -1) __GLOBAL_PLUGIN__.push(plugin);
		else warn$1(`The plugin ${plugin.name} has been registered.`);
	});
};
const getGlobalHostPlugins = () => nativeGlobal.__FEDERATION__.__GLOBAL_PLUGIN__;
const getPreloaded = (id) => CurrentGlobal.__FEDERATION__.__PRELOADED_MAP__.get(id);
const setPreloaded = (id) => CurrentGlobal.__FEDERATION__.__PRELOADED_MAP__.set(id, true);

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/semver/constants.js
//#region src/utils/semver/constants.ts
const buildIdentifier = "[0-9A-Za-z-]+";
const build = `(?:\\+(${buildIdentifier}(?:\\.${buildIdentifier})*))`;
const numericIdentifier = "0|[1-9]\\d*";
const numericIdentifierLoose = "[0-9]+";
const nonNumericIdentifier = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
const preReleaseIdentifierLoose = `(?:${numericIdentifierLoose}|${nonNumericIdentifier})`;
const preReleaseLoose = `(?:-?(${preReleaseIdentifierLoose}(?:\\.${preReleaseIdentifierLoose})*))`;
const preReleaseIdentifier = `(?:${numericIdentifier}|${nonNumericIdentifier})`;
const preRelease = `(?:-(${preReleaseIdentifier}(?:\\.${preReleaseIdentifier})*))`;
const xRangeIdentifier = `${numericIdentifier}|x|X|\\*`;
const xRangePlain = `[v=\\s]*(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:${preRelease})?${build}?)?)?`;
const hyphenRange = `^\\s*(${xRangePlain})\\s+-\\s+(${xRangePlain})\\s*$`;
const loosePlain = `[v=\\s]*${`(${numericIdentifierLoose})\\.(${numericIdentifierLoose})\\.(${numericIdentifierLoose})`}${preReleaseLoose}?${build}?`;
const gtlt = "((?:<|>)?=?)";
const comparatorTrim = `(\\s*)${gtlt}\\s*(${loosePlain}|${xRangePlain})`;
const loneTilde = "(?:~>?)";
const tildeTrim = `(\\s*)${loneTilde}\\s+`;
const loneCaret = "(?:\\^)";
const caretTrim = `(\\s*)${loneCaret}\\s+`;
const star = "(<|>)?=?\\s*\\*";
const caret = `^${loneCaret}${xRangePlain}$`;
const fullPlain = `v?${`(${numericIdentifier})\\.(${numericIdentifier})\\.(${numericIdentifier})`}${preRelease}?${build}?`;
const tilde = `^${loneTilde}${xRangePlain}$`;
const xRange = `^${gtlt}\\s*${xRangePlain}$`;
const comparator = `^${gtlt}\\s*(${fullPlain})$|^$`;
const gte0 = "^\\s*>=\\s*0.0.0\\s*$";

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/semver/utils.js


//#region src/utils/semver/utils.ts
function parseRegex(source) {
	return new RegExp(source);
}
function isXVersion(version) {
	return !version || version.toLowerCase() === "x" || version === "*";
}
function pipe(...fns) {
	return (x) => fns.reduce((v, f) => f(v), x);
}
function extractComparator(comparatorString) {
	return comparatorString.match(parseRegex(comparator));
}
function combineVersion(major, minor, patch, preRelease) {
	const mainVersion = `${major}.${minor}.${patch}`;
	if (preRelease) return `${mainVersion}-${preRelease}`;
	return mainVersion;
}

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/semver/parser.js



//#region src/utils/semver/parser.ts
function parseHyphen(range) {
	return range.replace(parseRegex(hyphenRange), (_range, from, fromMajor, fromMinor, fromPatch, _fromPreRelease, _fromBuild, to, toMajor, toMinor, toPatch, toPreRelease) => {
		if (isXVersion(fromMajor)) from = "";
		else if (isXVersion(fromMinor)) from = `>=${fromMajor}.0.0`;
		else if (isXVersion(fromPatch)) from = `>=${fromMajor}.${fromMinor}.0`;
		else from = `>=${from}`;
		if (isXVersion(toMajor)) to = "";
		else if (isXVersion(toMinor)) to = `<${Number(toMajor) + 1}.0.0-0`;
		else if (isXVersion(toPatch)) to = `<${toMajor}.${Number(toMinor) + 1}.0-0`;
		else if (toPreRelease) to = `<=${toMajor}.${toMinor}.${toPatch}-${toPreRelease}`;
		else to = `<=${to}`;
		return `${from} ${to}`.trim();
	});
}
function parseComparatorTrim(range) {
	return range.replace(parseRegex(comparatorTrim), "$1$2$3");
}
function parseTildeTrim(range) {
	return range.replace(parseRegex(tildeTrim), "$1~");
}
function parseCaretTrim(range) {
	return range.replace(parseRegex(caretTrim), "$1^");
}
function parseCarets(range) {
	return range.trim().split(/\s+/).map((rangeVersion) => rangeVersion.replace(parseRegex(caret), (_, major, minor, patch, preRelease) => {
		if (isXVersion(major)) return "";
		else if (isXVersion(minor)) return `>=${major}.0.0 <${Number(major) + 1}.0.0-0`;
		else if (isXVersion(patch)) if (major === "0") return `>=${major}.${minor}.0 <${major}.${Number(minor) + 1}.0-0`;
		else return `>=${major}.${minor}.0 <${Number(major) + 1}.0.0-0`;
		else if (preRelease) if (major === "0") if (minor === "0") return `>=${major}.${minor}.${patch}-${preRelease} <${major}.${minor}.${Number(patch) + 1}-0`;
		else return `>=${major}.${minor}.${patch}-${preRelease} <${major}.${Number(minor) + 1}.0-0`;
		else return `>=${major}.${minor}.${patch}-${preRelease} <${Number(major) + 1}.0.0-0`;
		else {
			if (major === "0") if (minor === "0") return `>=${major}.${minor}.${patch} <${major}.${minor}.${Number(patch) + 1}-0`;
			else return `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0-0`;
			return `>=${major}.${minor}.${patch} <${Number(major) + 1}.0.0-0`;
		}
	})).join(" ");
}
function parseTildes(range) {
	return range.trim().split(/\s+/).map((rangeVersion) => rangeVersion.replace(parseRegex(tilde), (_, major, minor, patch, preRelease) => {
		if (isXVersion(major)) return "";
		else if (isXVersion(minor)) return `>=${major}.0.0 <${Number(major) + 1}.0.0-0`;
		else if (isXVersion(patch)) return `>=${major}.${minor}.0 <${major}.${Number(minor) + 1}.0-0`;
		else if (preRelease) return `>=${major}.${minor}.${patch}-${preRelease} <${major}.${Number(minor) + 1}.0-0`;
		return `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0-0`;
	})).join(" ");
}
function parseXRanges(range) {
	return range.split(/\s+/).map((rangeVersion) => rangeVersion.trim().replace(parseRegex(xRange), (ret, gtlt, major, minor, patch, preRelease) => {
		const isXMajor = isXVersion(major);
		const isXMinor = isXMajor || isXVersion(minor);
		const isXPatch = isXMinor || isXVersion(patch);
		if (gtlt === "=" && isXPatch) gtlt = "";
		preRelease = "";
		if (isXMajor) if (gtlt === ">" || gtlt === "<") return "<0.0.0-0";
		else return "*";
		else if (gtlt && isXPatch) {
			if (isXMinor) minor = 0;
			patch = 0;
			if (gtlt === ">") {
				gtlt = ">=";
				if (isXMinor) {
					major = Number(major) + 1;
					minor = 0;
					patch = 0;
				} else {
					minor = Number(minor) + 1;
					patch = 0;
				}
			} else if (gtlt === "<=") {
				gtlt = "<";
				if (isXMinor) major = Number(major) + 1;
				else minor = Number(minor) + 1;
			}
			if (gtlt === "<") preRelease = "-0";
			return `${gtlt + major}.${minor}.${patch}${preRelease}`;
		} else if (isXMinor) return `>=${major}.0.0${preRelease} <${Number(major) + 1}.0.0-0`;
		else if (isXPatch) return `>=${major}.${minor}.0${preRelease} <${major}.${Number(minor) + 1}.0-0`;
		return ret;
	})).join(" ");
}
function parseStar(range) {
	return range.trim().replace(parseRegex(star), "");
}
function parseGTE0(comparatorString) {
	return comparatorString.trim().replace(parseRegex(gte0), "");
}

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/semver/compare.js
//#region src/utils/semver/compare.ts
function compareAtom(rangeAtom, versionAtom) {
	rangeAtom = Number(rangeAtom) || rangeAtom;
	versionAtom = Number(versionAtom) || versionAtom;
	if (rangeAtom > versionAtom) return 1;
	if (rangeAtom === versionAtom) return 0;
	return -1;
}
function comparePreRelease(rangeAtom, versionAtom) {
	const { preRelease: rangePreRelease } = rangeAtom;
	const { preRelease: versionPreRelease } = versionAtom;
	if (rangePreRelease === void 0 && Boolean(versionPreRelease)) return 1;
	if (Boolean(rangePreRelease) && versionPreRelease === void 0) return -1;
	if (rangePreRelease === void 0 && versionPreRelease === void 0) return 0;
	for (let i = 0, n = rangePreRelease.length; i <= n; i++) {
		const rangeElement = rangePreRelease[i];
		const versionElement = versionPreRelease[i];
		if (rangeElement === versionElement) continue;
		if (rangeElement === void 0 && versionElement === void 0) return 0;
		if (!rangeElement) return 1;
		if (!versionElement) return -1;
		return compareAtom(rangeElement, versionElement);
	}
	return 0;
}
function compareVersion(rangeAtom, versionAtom) {
	return compareAtom(rangeAtom.major, versionAtom.major) || compareAtom(rangeAtom.minor, versionAtom.minor) || compareAtom(rangeAtom.patch, versionAtom.patch) || comparePreRelease(rangeAtom, versionAtom);
}
function eq(rangeAtom, versionAtom) {
	return rangeAtom.version === versionAtom.version;
}
function compare(rangeAtom, versionAtom) {
	switch (rangeAtom.operator) {
		case "":
		case "=": return eq(rangeAtom, versionAtom);
		case ">": return compareVersion(rangeAtom, versionAtom) < 0;
		case ">=": return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) < 0;
		case "<": return compareVersion(rangeAtom, versionAtom) > 0;
		case "<=": return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) > 0;
		case void 0: return true;
		default: return false;
	}
}

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/semver/index.js




//#region src/utils/semver/index.ts
function parseComparatorString(range) {
	return pipe(parseCarets, parseTildes, parseXRanges, parseStar)(range);
}
function parseRange(range) {
	return pipe(parseHyphen, parseComparatorTrim, parseTildeTrim, parseCaretTrim)(range.trim()).split(/\s+/).join(" ");
}
function satisfy(version, range) {
	if (!version) return false;
	const extractedVersion = extractComparator(version);
	if (!extractedVersion) return false;
	const [, versionOperator, , versionMajor, versionMinor, versionPatch, versionPreRelease] = extractedVersion;
	const versionAtom = {
		operator: versionOperator,
		version: combineVersion(versionMajor, versionMinor, versionPatch, versionPreRelease),
		major: versionMajor,
		minor: versionMinor,
		patch: versionPatch,
		preRelease: versionPreRelease?.split(".")
	};
	const orRanges = range.split("||");
	for (const orRange of orRanges) {
		const trimmedOrRange = orRange.trim();
		if (!trimmedOrRange) return true;
		if (trimmedOrRange === "*" || trimmedOrRange === "x") return true;
		try {
			const parsedSubRange = parseRange(trimmedOrRange);
			if (!parsedSubRange.trim()) return true;
			const parsedComparatorString = parsedSubRange.split(" ").map((rangeVersion) => parseComparatorString(rangeVersion)).join(" ");
			if (!parsedComparatorString.trim()) return true;
			const comparators = parsedComparatorString.split(/\s+/).map((comparator) => parseGTE0(comparator)).filter(Boolean);
			if (comparators.length === 0) continue;
			let subRangeSatisfied = true;
			for (const comparator of comparators) {
				const extractedComparator = extractComparator(comparator);
				if (!extractedComparator) {
					subRangeSatisfied = false;
					break;
				}
				const [, rangeOperator, , rangeMajor, rangeMinor, rangePatch, rangePreRelease] = extractedComparator;
				if (!compare({
					operator: rangeOperator,
					version: combineVersion(rangeMajor, rangeMinor, rangePatch, rangePreRelease),
					major: rangeMajor,
					minor: rangeMinor,
					patch: rangePatch,
					preRelease: rangePreRelease?.split(".")
				}, versionAtom)) {
					subRangeSatisfied = false;
					break;
				}
			}
			if (subRangeSatisfied) return true;
		} catch (e) {
			console.error(`[semver] Error processing range part "${trimmedOrRange}":`, e);
			continue;
		}
	}
	return false;
}

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/constant.js
//#region src/constant.ts
const DEFAULT_SCOPE = "default";
const DEFAULT_REMOTE_TYPE = "global";

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/share.js







//#region src/utils/share.ts
function formatShare(shareArgs, from, name, shareStrategy) {
	let get;
	if ("get" in shareArgs) get = shareArgs.get;
	else if ("lib" in shareArgs) get = () => Promise.resolve(shareArgs.lib);
	else get = () => Promise.resolve(() => {
		logger_error(`Cannot get shared "${name}" from "${from}": neither "get" nor "lib" is provided in the share config.`);
	});
	if (shareArgs.shareConfig?.eager && shareArgs.treeShaking?.mode) logger_error(`Invalid shared config for "${name}" from "${from}": cannot use both "eager: true" and "treeShaking.mode" simultaneously. Choose one strategy.`);
	return {
		deps: [],
		useIn: [],
		from,
		loading: null,
		...shareArgs,
		shareConfig: {
			requiredVersion: `^${shareArgs.version}`,
			singleton: false,
			eager: false,
			strictVersion: false,
			...shareArgs.shareConfig
		},
		get,
		loaded: shareArgs?.loaded || "lib" in shareArgs ? true : void 0,
		version: shareArgs.version ?? "0",
		scope: Array.isArray(shareArgs.scope) ? shareArgs.scope : [shareArgs.scope ?? "default"],
		strategy: (shareArgs.strategy ?? shareStrategy) || "version-first",
		treeShaking: shareArgs.treeShaking ? {
			...shareArgs.treeShaking,
			mode: shareArgs.treeShaking.mode ?? "server-calc",
			status: shareArgs.treeShaking.status ?? TreeShakingStatus.UNKNOWN,
			useIn: []
		} : void 0
	};
}
function formatShareConfigs(prevOptions, newOptions) {
	const shareArgs = newOptions.shared || {};
	const from = newOptions.name;
	const newShareInfos = Object.keys(shareArgs).reduce((res, pkgName) => {
		const arrayShareArgs = arrayOptions(shareArgs[pkgName]);
		res[pkgName] = res[pkgName] || [];
		arrayShareArgs.forEach((shareConfig) => {
			res[pkgName].push(formatShare(shareConfig, from, pkgName, newOptions.shareStrategy));
		});
		return res;
	}, {});
	const allShareInfos = { ...prevOptions.shared };
	Object.keys(newShareInfos).forEach((shareKey) => {
		if (!allShareInfos[shareKey]) allShareInfos[shareKey] = newShareInfos[shareKey];
		else newShareInfos[shareKey].forEach((newUserSharedOptions) => {
			if (!allShareInfos[shareKey].find((sharedVal) => sharedVal.version === newUserSharedOptions.version)) allShareInfos[shareKey].push(newUserSharedOptions);
		});
	});
	return {
		allShareInfos,
		newShareInfos
	};
}
function shouldUseTreeShaking(treeShaking, usedExports) {
	if (!treeShaking) return false;
	const { status, mode } = treeShaking;
	if (status === TreeShakingStatus.NO_USE) return false;
	if (status === TreeShakingStatus.CALCULATED) return true;
	if (mode === "runtime-infer") {
		if (!usedExports) return true;
		return isMatchUsedExports(treeShaking, usedExports);
	}
	return false;
}
/**
* compare version a and b, return true if a is less than b
*/
function versionLt(a, b) {
	const transformInvalidVersion = (version) => {
		if (!Number.isNaN(Number(version))) {
			const splitArr = version.split(".");
			let validVersion = version;
			for (let i = 0; i < 3 - splitArr.length; i++) validVersion += ".0";
			return validVersion;
		}
		return version;
	};
	if (satisfy(transformInvalidVersion(a), `<=${transformInvalidVersion(b)}`)) return true;
	else return false;
}
const findVersion = (shareVersionMap, cb) => {
	const callback = cb || function(prev, cur) {
		return versionLt(prev, cur);
	};
	return Object.keys(shareVersionMap).reduce((prev, cur) => {
		if (!prev) return cur;
		if (callback(prev, cur)) return cur;
		if (prev === "0") return cur;
		return prev;
	}, 0);
};
const isLoaded = (shared) => {
	return Boolean(shared.loaded) || typeof shared.lib === "function";
};
const isLoading = (shared) => {
	return Boolean(shared.loading);
};
const isMatchUsedExports = (treeShaking, usedExports) => {
	if (!treeShaking || !usedExports) return false;
	const { usedExports: treeShakingUsedExports } = treeShaking;
	if (!treeShakingUsedExports) return false;
	if (usedExports.every((e) => treeShakingUsedExports.includes(e))) return true;
	return false;
};
function findSingletonVersionOrderByVersion(shareScopeMap, scope, pkgName, treeShaking) {
	const versions = shareScopeMap[scope][pkgName];
	let version = "";
	let useTreesShaking = shouldUseTreeShaking(treeShaking);
	const callback = function(prev, cur) {
		if (useTreesShaking) {
			if (!versions[prev].treeShaking) return true;
			if (!versions[cur].treeShaking) return false;
			return !isLoaded(versions[prev].treeShaking) && versionLt(prev, cur);
		}
		return !isLoaded(versions[prev]) && versionLt(prev, cur);
	};
	if (useTreesShaking) {
		version = findVersion(shareScopeMap[scope][pkgName], callback);
		if (version) return {
			version,
			useTreesShaking
		};
		useTreesShaking = false;
	}
	return {
		version: findVersion(shareScopeMap[scope][pkgName], callback),
		useTreesShaking
	};
}
const isLoadingOrLoaded = (shared) => {
	return isLoaded(shared) || isLoading(shared);
};
function findSingletonVersionOrderByLoaded(shareScopeMap, scope, pkgName, treeShaking) {
	const versions = shareScopeMap[scope][pkgName];
	let version = "";
	let useTreesShaking = shouldUseTreeShaking(treeShaking);
	const callback = function(prev, cur) {
		if (useTreesShaking) {
			if (!versions[prev].treeShaking) return true;
			if (!versions[cur].treeShaking) return false;
			if (isLoadingOrLoaded(versions[cur].treeShaking)) if (isLoadingOrLoaded(versions[prev].treeShaking)) return Boolean(versionLt(prev, cur));
			else return true;
			if (isLoadingOrLoaded(versions[prev].treeShaking)) return false;
		}
		if (isLoadingOrLoaded(versions[cur])) if (isLoadingOrLoaded(versions[prev])) return Boolean(versionLt(prev, cur));
		else return true;
		if (isLoadingOrLoaded(versions[prev])) return false;
		return versionLt(prev, cur);
	};
	if (useTreesShaking) {
		version = findVersion(shareScopeMap[scope][pkgName], callback);
		if (version) return {
			version,
			useTreesShaking
		};
		useTreesShaking = false;
	}
	return {
		version: findVersion(shareScopeMap[scope][pkgName], callback),
		useTreesShaking
	};
}
function getFindShareFunction(strategy) {
	if (strategy === "loaded-first") return findSingletonVersionOrderByLoaded;
	return findSingletonVersionOrderByVersion;
}
function getRegisteredShare(localShareScopeMap, pkgName, shareInfo, resolveShare) {
	if (!localShareScopeMap) return;
	const { shareConfig, scope = DEFAULT_SCOPE, strategy, treeShaking } = shareInfo;
	const scopes = Array.isArray(scope) ? scope : [scope];
	for (const sc of scopes) if (shareConfig && localShareScopeMap[sc] && localShareScopeMap[sc][pkgName]) {
		const { requiredVersion } = shareConfig;
		const { version: maxOrSingletonVersion, useTreesShaking } = getFindShareFunction(strategy)(localShareScopeMap, sc, pkgName, treeShaking);
		const defaultResolver = () => {
			const shared = localShareScopeMap[sc][pkgName][maxOrSingletonVersion];
			if (shareConfig.singleton) {
				if (typeof requiredVersion === "string" && !satisfy(maxOrSingletonVersion, requiredVersion)) {
					const msg = `Version ${maxOrSingletonVersion} from ${maxOrSingletonVersion && shared.from} of shared singleton module ${pkgName} does not satisfy the requirement of ${shareInfo.from} which needs ${requiredVersion})`;
					if (shareConfig.strictVersion) logger_error(msg);
					else warn$1(msg);
				}
				return {
					shared,
					useTreesShaking
				};
			} else {
				if (requiredVersion === false || requiredVersion === "*") return {
					shared,
					useTreesShaking
				};
				if (satisfy(maxOrSingletonVersion, requiredVersion)) return {
					shared,
					useTreesShaking
				};
				const _usedTreeShaking = shouldUseTreeShaking(treeShaking);
				if (_usedTreeShaking) for (const [versionKey, versionValue] of Object.entries(localShareScopeMap[sc][pkgName])) {
					if (!shouldUseTreeShaking(versionValue.treeShaking, treeShaking?.usedExports)) continue;
					if (satisfy(versionKey, requiredVersion)) return {
						shared: versionValue,
						useTreesShaking: _usedTreeShaking
					};
				}
				for (const [versionKey, versionValue] of Object.entries(localShareScopeMap[sc][pkgName])) if (satisfy(versionKey, requiredVersion)) return {
					shared: versionValue,
					useTreesShaking: false
				};
			}
		};
		const params = {
			shareScopeMap: localShareScopeMap,
			scope: sc,
			pkgName,
			version: maxOrSingletonVersion,
			GlobalFederation: Global.__FEDERATION__,
			shareInfo,
			resolver: defaultResolver
		};
		return (resolveShare.emit(params) || params).resolver();
	}
}
function getGlobalShareScope() {
	return Global.__FEDERATION__.__SHARE__;
}
function getTargetSharedOptions(options) {
	const { pkgName, extraOptions, shareInfos } = options;
	const defaultResolver = (sharedOptions) => {
		if (!sharedOptions) return;
		const shareVersionMap = {};
		sharedOptions.forEach((shared) => {
			shareVersionMap[shared.version] = shared;
		});
		const callback = function(prev, cur) {
			return !isLoaded(shareVersionMap[prev]) && versionLt(prev, cur);
		};
		return shareVersionMap[findVersion(shareVersionMap, callback)];
	};
	const resolver = extraOptions?.resolver ?? defaultResolver;
	const isPlainObject = (val) => {
		return val !== null && typeof val === "object" && !Array.isArray(val);
	};
	const merge = (...sources) => {
		const out = {};
		for (const src of sources) {
			if (!src) continue;
			for (const [key, value] of Object.entries(src)) {
				const prev = out[key];
				if (isPlainObject(prev) && isPlainObject(value)) out[key] = merge(prev, value);
				else if (value !== void 0) out[key] = value;
			}
		}
		return out;
	};
	return merge(resolver(shareInfos[pkgName]), extraOptions?.customShareInfo);
}
const addUseIn = (shared, from) => {
	if (!shared.useIn) shared.useIn = [];
	addUniqueItem(shared.useIn, from);
};
function directShare(shared, useTreesShaking) {
	if (useTreesShaking && shared.treeShaking) return shared.treeShaking;
	return shared;
}

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/manifest.js
//#region src/utils/manifest.ts
function matchRemoteWithNameAndExpose(remotes, id) {
	for (const remote of remotes) {
		const isNameMatched = id.startsWith(remote.name);
		let expose = id.replace(remote.name, "");
		if (isNameMatched) {
			if (expose.startsWith("/")) {
				const pkgNameOrAlias = remote.name;
				expose = `.${expose}`;
				return {
					pkgNameOrAlias,
					expose,
					remote
				};
			} else if (expose === "") return {
				pkgNameOrAlias: remote.name,
				expose: ".",
				remote
			};
		}
		const isAliasMatched = remote.alias && id.startsWith(remote.alias);
		let exposeWithAlias = remote.alias && id.replace(remote.alias, "");
		if (remote.alias && isAliasMatched) {
			if (exposeWithAlias && exposeWithAlias.startsWith("/")) {
				const pkgNameOrAlias = remote.alias;
				exposeWithAlias = `.${exposeWithAlias}`;
				return {
					pkgNameOrAlias,
					expose: exposeWithAlias,
					remote
				};
			} else if (exposeWithAlias === "") return {
				pkgNameOrAlias: remote.alias,
				expose: ".",
				remote
			};
		}
	}
}
function matchRemote(remotes, nameOrAlias) {
	for (const remote of remotes) {
		if (nameOrAlias === remote.name) return remote;
		if (remote.alias && nameOrAlias === remote.alias) return remote;
	}
}

//#endregion


;// ../node_modules/@module-federation/sdk/dist/dom.js


//#region src/dom.ts
async function dom_safeWrapper(callback, disableWarn) {
	try {
		return await callback();
	} catch (e) {
		!disableWarn && warn(e);
		return;
	}
}
function dom_isStaticResourcesEqual(url1, url2) {
	const REG_EXP = /^(https?:)?\/\//i;
	return url1.replace(REG_EXP, "").replace(/\/$/, "") === url2.replace(REG_EXP, "").replace(/\/$/, "");
}
function createScript(info) {
	let script = null;
	let needAttach = true;
	let timeout = 2e4;
	let timeoutId;
	const scripts = document.getElementsByTagName("script");
	for (let i = 0; i < scripts.length; i++) {
		const s = scripts[i];
		const scriptSrc = s.getAttribute("src");
		if (scriptSrc && dom_isStaticResourcesEqual(scriptSrc, info.url)) {
			script = s;
			needAttach = false;
			break;
		}
	}
	if (!script) {
		const attrs = info.attrs;
		script = document.createElement("script");
		script.type = attrs?.["type"] === "module" ? "module" : "text/javascript";
		let createScriptRes = void 0;
		if (info.createScriptHook) {
			createScriptRes = info.createScriptHook(info.url, info.attrs);
			if (createScriptRes instanceof HTMLScriptElement) script = createScriptRes;
			else if (typeof createScriptRes === "object") {
				if ("script" in createScriptRes && createScriptRes.script) script = createScriptRes.script;
				if ("timeout" in createScriptRes && createScriptRes.timeout) timeout = createScriptRes.timeout;
			}
		}
		if (!script.src) script.src = info.url;
		if (attrs && !createScriptRes) Object.keys(attrs).forEach((name) => {
			if (script) {
				if (name === "async" || name === "defer") script[name] = attrs[name];
				else if (!script.getAttribute(name)) script.setAttribute(name, attrs[name]);
			}
		});
	}
	let executionError = null;
	const executionErrorHandler = typeof window !== "undefined" ? (evt) => {
		if (evt.filename && dom_isStaticResourcesEqual(evt.filename, info.url)) {
			const err = /* @__PURE__ */ new Error(`ScriptExecutionError: Script "${info.url}" loaded but threw a runtime error during execution: ${evt.message} (${evt.filename}:${evt.lineno}:${evt.colno})`);
			err.name = "ScriptExecutionError";
			executionError = err;
		}
	} : null;
	if (executionErrorHandler) window.addEventListener("error", executionErrorHandler);
	const onScriptComplete = async (prev, event) => {
		clearTimeout(timeoutId);
		if (executionErrorHandler) window.removeEventListener("error", executionErrorHandler);
		const onScriptCompleteCallback = () => {
			if (event?.type === "error") {
				const networkError = /* @__PURE__ */ new Error(event?.isTimeout ? `ScriptNetworkError: Script "${info.url}" timed out.` : `ScriptNetworkError: Failed to load script "${info.url}" - the script URL is unreachable or the server returned an error (network failure, 404, CORS, etc.)`);
				networkError.name = "ScriptNetworkError";
				info?.onErrorCallback && info?.onErrorCallback(networkError);
			} else if (executionError) info?.onErrorCallback && info?.onErrorCallback(executionError);
			else info?.cb && info?.cb();
		};
		if (script) {
			script.onerror = null;
			script.onload = null;
			dom_safeWrapper(() => {
				const { needDeleteScript = true } = info;
				if (needDeleteScript) script?.parentNode && script.parentNode.removeChild(script);
			});
			if (prev && typeof prev === "function") {
				const result = prev(event);
				if (result instanceof Promise) {
					const res = await result;
					onScriptCompleteCallback();
					return res;
				}
				onScriptCompleteCallback();
				return result;
			}
		}
		onScriptCompleteCallback();
	};
	script.onerror = onScriptComplete.bind(null, script.onerror);
	script.onload = onScriptComplete.bind(null, script.onload);
	timeoutId = setTimeout(() => {
		onScriptComplete(null, {
			type: "error",
			isTimeout: true
		});
	}, timeout);
	return {
		script,
		needAttach
	};
}
function createLink(info) {
	let link = null;
	let needAttach = true;
	const links = document.getElementsByTagName("link");
	for (let i = 0; i < links.length; i++) {
		const l = links[i];
		const linkHref = l.getAttribute("href");
		const linkRel = l.getAttribute("rel");
		if (linkHref && dom_isStaticResourcesEqual(linkHref, info.url) && linkRel === info.attrs["rel"]) {
			link = l;
			needAttach = false;
			break;
		}
	}
	if (!link) {
		link = document.createElement("link");
		link.setAttribute("href", info.url);
		let createLinkRes = void 0;
		const attrs = info.attrs;
		if (info.createLinkHook) {
			createLinkRes = info.createLinkHook(info.url, attrs);
			if (createLinkRes instanceof HTMLLinkElement) link = createLinkRes;
		}
		if (attrs && !createLinkRes) Object.keys(attrs).forEach((name) => {
			if (link && !link.getAttribute(name)) link.setAttribute(name, attrs[name]);
		});
	}
	const onLinkComplete = (prev, event) => {
		const onLinkCompleteCallback = () => {
			if (event?.type === "error") info?.onErrorCallback && info?.onErrorCallback(event);
			else info?.cb && info?.cb();
		};
		if (link) {
			link.onerror = null;
			link.onload = null;
			dom_safeWrapper(() => {
				const { needDeleteLink = true } = info;
				if (needDeleteLink) link?.parentNode && link.parentNode.removeChild(link);
			});
			if (prev) {
				const res = prev(event);
				onLinkCompleteCallback();
				return res;
			}
		}
		onLinkCompleteCallback();
	};
	link.onerror = onLinkComplete.bind(null, link.onerror);
	link.onload = onLinkComplete.bind(null, link.onload);
	return {
		link,
		needAttach
	};
}
function loadScript(url, info) {
	const { attrs = {}, createScriptHook } = info;
	return new Promise((resolve, reject) => {
		const { script, needAttach } = createScript({
			url,
			cb: resolve,
			onErrorCallback: reject,
			attrs: {
				fetchpriority: "high",
				...attrs
			},
			createScriptHook,
			needDeleteScript: true
		});
		needAttach && document.head.appendChild(script);
	});
}

//#endregion


;// ../node_modules/@module-federation/sdk/dist/node.js
//#region src/node.ts
const sdkImportCache = /* @__PURE__ */ new Map();
function importNodeModule(name) {
	if (!name) throw new Error("import specifier is required");
	if (sdkImportCache.has(name)) return sdkImportCache.get(name);
	const promise = new Function("name", `return import(name)`)(name).then((res) => res).catch((error) => {
		console.error(`Error importing module ${name}:`, error);
		sdkImportCache.delete(name);
		throw error;
	});
	sdkImportCache.set(name, promise);
	return promise;
}
const loadNodeFetch = async () => {
	const fetchModule = await importNodeModule("node-fetch");
	return fetchModule.default || fetchModule;
};
const lazyLoaderHookFetch = async (input, init, loaderHook) => {
	const hook = (url, init) => {
		return loaderHook.lifecycle.fetch.emit(url, init);
	};
	const res = await hook(input, init || {});
	if (!res || !(res instanceof Response)) return (typeof fetch === "undefined" ? await loadNodeFetch() : fetch)(input, init || {});
	return res;
};
const createScriptNode = typeof ENV_TARGET === "undefined" || ENV_TARGET !== "web" ? (url, cb, attrs, loaderHook) => {
	if (loaderHook?.createScriptHook) {
		const hookResult = loaderHook.createScriptHook(url);
		if (hookResult && typeof hookResult === "object" && "url" in hookResult) url = hookResult.url;
	}
	let urlObj;
	try {
		urlObj = new URL(url);
	} catch (e) {
		console.error("Error constructing URL:", e);
		cb(/* @__PURE__ */ new Error(`Invalid URL: ${e}`));
		return;
	}
	const getFetch = async () => {
		if (loaderHook?.fetch) return (input, init) => lazyLoaderHookFetch(input, init, loaderHook);
		return typeof fetch === "undefined" ? loadNodeFetch() : fetch;
	};
	const handleScriptFetch = async (f, urlObj) => {
		try {
			const res = await f(urlObj.href);
			const data = await res.text();
			const [path, vm] = await Promise.all([importNodeModule("path"), importNodeModule("vm")]);
			const scriptContext = {
				exports: {},
				module: { exports: {} }
			};
			const urlDirname = urlObj.pathname.split("/").slice(0, -1).join("/");
			const filename = path.basename(urlObj.pathname);
			const script = new vm.Script(`(function(exports, module, require, __dirname, __filename) {${data}\n})`, {
				filename,
				importModuleDynamically: vm.constants?.USE_MAIN_CONTEXT_DEFAULT_LOADER ?? importNodeModule
			});
			let requireFn;
			requireFn = (await importNodeModule("node:module")).createRequire(urlObj.protocol === "file:" || urlObj.protocol === "node:" ? urlObj.href : path.join(process.cwd(), "__mf_require_base__.js"));
			script.runInThisContext()(scriptContext.exports, scriptContext.module, requireFn, urlDirname, filename);
			const exportedInterface = scriptContext.module.exports || scriptContext.exports;
			if (attrs && exportedInterface && attrs["globalName"]) {
				cb(void 0, exportedInterface[attrs["globalName"]] || exportedInterface);
				return;
			}
			cb(void 0, exportedInterface);
		} catch (e) {
			cb(e instanceof Error ? e : /* @__PURE__ */ new Error(`Script execution error: ${e}`));
		}
	};
	getFetch().then(async (f) => {
		if (attrs?.["type"] === "esm" || attrs?.["type"] === "module") return loadModule(urlObj.href, {
			fetch: f,
			vm: await importNodeModule("vm")
		}).then(async (module) => {
			await module.evaluate();
			cb(void 0, module.namespace);
		}).catch((e) => {
			cb(e instanceof Error ? e : /* @__PURE__ */ new Error(`Script execution error: ${e}`));
		});
		handleScriptFetch(f, urlObj);
	}).catch((err) => {
		cb(err);
	});
} : (url, cb, attrs, loaderHook) => {
	cb(/* @__PURE__ */ new Error("createScriptNode is disabled in non-Node.js environment"));
};
const loadScriptNode = typeof ENV_TARGET === "undefined" || ENV_TARGET !== "web" ? (url, info) => {
	return new Promise((resolve, reject) => {
		createScriptNode(url, (error, scriptContext) => {
			if (error) reject(error);
			else {
				const remoteEntryKey = info?.attrs?.["globalName"] || `__FEDERATION_${info?.attrs?.["name"]}:custom__`;
				resolve(globalThis[remoteEntryKey] = scriptContext);
			}
		}, info.attrs, info.loaderHook);
	});
} : (url, info) => {
	throw new Error("loadScriptNode is disabled in non-Node.js environment");
};
const esmModuleCache = /* @__PURE__ */ new Map();
async function loadModule(url, options) {
	if (esmModuleCache.has(url)) return esmModuleCache.get(url);
	const { fetch, vm } = options;
	const code = await (await fetch(url)).text();
	const module = new vm.SourceTextModule(code, { importModuleDynamically: async (specifier, script) => {
		const resolvedUrl = new URL(specifier, url).href;
		return loadModule(resolvedUrl, options);
	} });
	esmModuleCache.set(url, module);
	await module.link(async (specifier) => {
		const resolvedUrl = new URL(specifier, url).href;
		return await loadModule(resolvedUrl, options);
	});
	return module;
}

//#endregion


;// ../node_modules/@module-federation/error-codes/dist/error-codes.mjs
//#region src/error-codes.ts
const RUNTIME_001 = "RUNTIME-001";
const RUNTIME_002 = "RUNTIME-002";
const RUNTIME_003 = "RUNTIME-003";
const RUNTIME_004 = "RUNTIME-004";
const RUNTIME_005 = "RUNTIME-005";
const RUNTIME_006 = "RUNTIME-006";
const RUNTIME_007 = "RUNTIME-007";
const RUNTIME_008 = "RUNTIME-008";
const RUNTIME_009 = "RUNTIME-009";
const RUNTIME_010 = "RUNTIME-010";
const RUNTIME_011 = "RUNTIME-011";
const error_codes_RUNTIME_012 = "RUNTIME-012";
const TYPE_001 = "TYPE-001";
const BUILD_001 = "BUILD-001";
const BUILD_002 = "BUILD-002";

//#endregion

//# sourceMappingURL=error-codes.mjs.map
;// ../node_modules/@module-federation/error-codes/dist/desc.mjs


//#region src/desc.ts
const runtimeDescMap = {
	[RUNTIME_001]: "Failed to get remoteEntry exports.",
	[RUNTIME_002]: "The remote entry interface does not contain \"init\"",
	[RUNTIME_003]: "Failed to get manifest.",
	[RUNTIME_004]: "Failed to locate remote.",
	[RUNTIME_005]: "Invalid loadShareSync function call from bundler runtime",
	[RUNTIME_006]: "Invalid loadShareSync function call from runtime",
	[RUNTIME_007]: "Failed to get remote snapshot.",
	[RUNTIME_008]: "Failed to load script resources.",
	[RUNTIME_009]: "Please call createInstance first.",
	[RUNTIME_010]: "The name option cannot be changed after initialization. If you want to create a new instance with a different name, please use \"createInstance\" api.",
	[RUNTIME_011]: "The remoteEntry URL is missing from the remote snapshot.",
	[error_codes_RUNTIME_012]: "The getter for the shared module is not a function. This may be caused by setting \"shared.import: false\" without the host providing the corresponding lib."
};
const typeDescMap = { [TYPE_001]: "Failed to generate type declaration. Execute the below cmd to reproduce and fix the error." };
const buildDescMap = {
	[BUILD_001]: "Failed to find expose module.",
	[BUILD_002]: "PublicPath is required in prod mode."
};
const errorDescMap = {
	...runtimeDescMap,
	...typeDescMap,
	...buildDescMap
};

//#endregion

//# sourceMappingURL=desc.mjs.map
;// ../node_modules/@module-federation/runtime-core/dist/utils/load.js






//#region src/utils/load.ts
const importCallback = ".then(callbacks[0]).catch(callbacks[1])";
async function loadEsmEntry({ entry, remoteEntryExports }) {
	return new Promise((resolve, reject) => {
		try {
			if (!remoteEntryExports) if (typeof FEDERATION_ALLOW_NEW_FUNCTION !== "undefined") new Function("callbacks", `import("${entry}")${importCallback}`)([resolve, reject]);
			else import(
				/* webpackIgnore: true */
				/* @vite-ignore */
				entry
).then(resolve).catch(reject);
			else resolve(remoteEntryExports);
		} catch (e) {
			logger_error(`Failed to load ESM entry from "${entry}". ${e instanceof Error ? e.message : String(e)}`);
		}
	});
}
async function loadSystemJsEntry({ entry, remoteEntryExports }) {
	return new Promise((resolve, reject) => {
		try {
			if (!remoteEntryExports) if (false) // removed by dead control flow
{}
			else new Function("callbacks", `System.import("${entry}")${importCallback}`)([resolve, reject]);
			else resolve(remoteEntryExports);
		} catch (e) {
			logger_error(`Failed to load SystemJS entry from "${entry}". ${e instanceof Error ? e.message : String(e)}`);
		}
	});
}
function handleRemoteEntryLoaded(name, globalName, entry) {
	const { remoteEntryKey, entryExports } = getRemoteEntryExports(name, globalName);
	if (!entryExports) logger_error(RUNTIME_001, runtimeDescMap, {
		remoteName: name,
		remoteEntryUrl: entry,
		remoteEntryKey
	});
	return entryExports;
}
async function loadEntryScript({ name, globalName, entry, remoteInfo, loaderHook, getEntryUrl }) {
	const { entryExports: remoteEntryExports } = getRemoteEntryExports(name, globalName);
	if (remoteEntryExports) return remoteEntryExports;
	const url = getEntryUrl ? getEntryUrl(entry) : entry;
	return loadScript(url, {
		attrs: {},
		createScriptHook: (url, attrs) => {
			const res = loaderHook.lifecycle.createScript.emit({
				url,
				attrs,
				remoteInfo
			});
			if (!res) return;
			if (res instanceof HTMLScriptElement) return res;
			if ("script" in res || "timeout" in res) return res;
		}
	}).then(() => {
		return handleRemoteEntryLoaded(name, globalName, entry);
	}, (loadError) => {
		const originalMsg = loadError instanceof Error ? loadError.message : String(loadError);
		logger_error(RUNTIME_008, runtimeDescMap, {
			remoteName: name,
			resourceUrl: url
		}, originalMsg);
	});
}
async function loadEntryDom({ remoteInfo, remoteEntryExports, loaderHook, getEntryUrl }) {
	const { entry, entryGlobalName: globalName, name, type } = remoteInfo;
	switch (type) {
		case "esm":
		case "module": return loadEsmEntry({
			entry,
			remoteEntryExports
		});
		case "system": return loadSystemJsEntry({
			entry,
			remoteEntryExports
		});
		default: return loadEntryScript({
			entry,
			globalName,
			name,
			remoteInfo,
			loaderHook,
			getEntryUrl
		});
	}
}
async function loadEntryNode({ remoteInfo, loaderHook }) {
	const { entry, entryGlobalName: globalName, name, type } = remoteInfo;
	const { entryExports: remoteEntryExports } = getRemoteEntryExports(name, globalName);
	if (remoteEntryExports) return remoteEntryExports;
	return loadScriptNode(entry, {
		attrs: {
			name,
			globalName,
			type
		},
		loaderHook: { createScriptHook: (url, attrs = {}) => {
			const res = loaderHook.lifecycle.createScript.emit({
				url,
				attrs,
				remoteInfo
			});
			if (!res) return;
			if ("url" in res) return res;
		} }
	}).then(() => {
		return handleRemoteEntryLoaded(name, globalName, entry);
	}).catch((e) => {
		logger_error(`Failed to load Node.js entry for remote "${name}" from "${entry}". ${e instanceof Error ? e.message : String(e)}`);
	});
}
function getRemoteEntryUniqueKey(remoteInfo) {
	const { entry, name } = remoteInfo;
	return composeKeyWithSeparator(name, entry);
}
async function getRemoteEntry(params) {
	const { origin, remoteEntryExports, remoteInfo, getEntryUrl, _inErrorHandling = false } = params;
	const uniqueKey = getRemoteEntryUniqueKey(remoteInfo);
	if (remoteEntryExports) return remoteEntryExports;
	if (!globalLoading[uniqueKey]) {
		const loadEntryHook = origin.remoteHandler.hooks.lifecycle.loadEntry;
		const loaderHook = origin.loaderHook;
		globalLoading[uniqueKey] = loadEntryHook.emit({
			loaderHook,
			remoteInfo,
			remoteEntryExports
		}).then((res) => {
			if (res) return res;
			return (typeof ENV_TARGET !== "undefined" ? ENV_TARGET === "web" : isBrowserEnvValue) ? loadEntryDom({
				remoteInfo,
				remoteEntryExports,
				loaderHook,
				getEntryUrl
			}) : loadEntryNode({
				remoteInfo,
				loaderHook
			});
		}).catch(async (err) => {
			const uniqueKey = getRemoteEntryUniqueKey(remoteInfo);
			const isScriptExecutionError = err instanceof Error && err.message.includes("ScriptExecutionError");
			if (err instanceof Error && err.message.includes(RUNTIME_008) && !isScriptExecutionError && !_inErrorHandling) {
				const wrappedGetRemoteEntry = (params) => {
					return getRemoteEntry({
						...params,
						_inErrorHandling: true
					});
				};
				const RemoteEntryExports = await origin.loaderHook.lifecycle.loadEntryError.emit({
					getRemoteEntry: wrappedGetRemoteEntry,
					origin,
					remoteInfo,
					remoteEntryExports,
					globalLoading: globalLoading,
					uniqueKey
				});
				if (RemoteEntryExports) return RemoteEntryExports;
			}
			throw err;
		});
	}
	return globalLoading[uniqueKey];
}
function getRemoteInfo(remote) {
	return {
		...remote,
		entry: "entry" in remote ? remote.entry : "",
		type: remote.type || DEFAULT_REMOTE_TYPE,
		entryGlobalName: remote.entryGlobalName || remote.name,
		shareScope: remote.shareScope || DEFAULT_SCOPE
	};
}

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/plugin.js


//#region src/utils/plugin.ts
function registerPlugins(plugins, instance) {
	const globalPlugins = getGlobalHostPlugins();
	const hookInstances = [
		instance.hooks,
		instance.remoteHandler.hooks,
		instance.sharedHandler.hooks,
		instance.snapshotHandler.hooks,
		instance.loaderHook,
		instance.bridgeHook
	];
	if (globalPlugins.length > 0) globalPlugins.forEach((plugin) => {
		if (plugins?.find((item) => item.name !== plugin.name)) plugins.push(plugin);
	});
	if (plugins && plugins.length > 0) plugins.forEach((plugin) => {
		hookInstances.forEach((hookInstance) => {
			hookInstance.applyPlugin(plugin, instance);
		});
	});
	return plugins;
}

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/index.js









;// ../node_modules/@module-federation/runtime-core/dist/utils/preload.js





//#region src/utils/preload.ts
function defaultPreloadArgs(preloadConfig) {
	return {
		resourceCategory: "sync",
		share: true,
		depsRemote: true,
		prefetchInterface: false,
		...preloadConfig
	};
}
function formatPreloadArgs(remotes, preloadArgs) {
	return preloadArgs.map((args) => {
		const remoteInfo = matchRemote(remotes, args.nameOrAlias);
		logger_assert(remoteInfo, `Unable to preload ${args.nameOrAlias} as it is not included in ${!remoteInfo && safeToString({
			remoteInfo,
			remotes
		})}`);
		return {
			remote: remoteInfo,
			preloadConfig: defaultPreloadArgs(args)
		};
	});
}
function normalizePreloadExposes(exposes) {
	if (!exposes) return [];
	return exposes.map((expose) => {
		if (expose === ".") return expose;
		if (expose.startsWith("./")) return expose.replace("./", "");
		return expose;
	});
}
function preloadAssets(remoteInfo, host, assets, useLinkPreload = true) {
	const { cssAssets, jsAssetsWithoutEntry, entryAssets } = assets;
	if (host.options.inBrowser) {
		entryAssets.forEach((asset) => {
			const { moduleInfo } = asset;
			const module = host.moduleCache.get(remoteInfo.name);
			if (module) getRemoteEntry({
				origin: host,
				remoteInfo: moduleInfo,
				remoteEntryExports: module.remoteEntryExports
			});
			else getRemoteEntry({
				origin: host,
				remoteInfo: moduleInfo,
				remoteEntryExports: void 0
			});
		});
		if (useLinkPreload) {
			const defaultAttrs = {
				rel: "preload",
				as: "style"
			};
			cssAssets.forEach((cssUrl) => {
				const { link: cssEl, needAttach } = createLink({
					url: cssUrl,
					cb: () => {},
					attrs: defaultAttrs,
					createLinkHook: (url, attrs) => {
						const res = host.loaderHook.lifecycle.createLink.emit({
							url,
							attrs,
							remoteInfo
						});
						if (res instanceof HTMLLinkElement) return res;
					}
				});
				needAttach && document.head.appendChild(cssEl);
			});
		} else {
			const defaultAttrs = {
				rel: "stylesheet",
				type: "text/css"
			};
			cssAssets.forEach((cssUrl) => {
				const { link: cssEl, needAttach } = createLink({
					url: cssUrl,
					cb: () => {},
					attrs: defaultAttrs,
					createLinkHook: (url, attrs) => {
						const res = host.loaderHook.lifecycle.createLink.emit({
							url,
							attrs,
							remoteInfo
						});
						if (res instanceof HTMLLinkElement) return res;
					},
					needDeleteLink: false
				});
				needAttach && document.head.appendChild(cssEl);
			});
		}
		if (useLinkPreload) {
			const defaultAttrs = {
				rel: "preload",
				as: "script"
			};
			jsAssetsWithoutEntry.forEach((jsUrl) => {
				const { link: linkEl, needAttach } = createLink({
					url: jsUrl,
					cb: () => {},
					attrs: defaultAttrs,
					createLinkHook: (url, attrs) => {
						const res = host.loaderHook.lifecycle.createLink.emit({
							url,
							attrs,
							remoteInfo
						});
						if (res instanceof HTMLLinkElement) return res;
					}
				});
				needAttach && document.head.appendChild(linkEl);
			});
		} else {
			const defaultAttrs = {
				fetchpriority: "high",
				type: remoteInfo?.type === "module" ? "module" : "text/javascript"
			};
			jsAssetsWithoutEntry.forEach((jsUrl) => {
				const { script: scriptEl, needAttach } = createScript({
					url: jsUrl,
					cb: () => {},
					attrs: defaultAttrs,
					createScriptHook: (url, attrs) => {
						const res = host.loaderHook.lifecycle.createScript.emit({
							url,
							attrs,
							remoteInfo
						});
						if (res instanceof HTMLScriptElement) return res;
					},
					needDeleteScript: true
				});
				needAttach && document.head.appendChild(scriptEl);
			});
		}
	}
}

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/helpers.js







//#region src/helpers.ts
const ShareUtils = {
	getRegisteredShare: getRegisteredShare,
	getGlobalShareScope: getGlobalShareScope
};
const GlobalUtils = {
	Global: Global,
	nativeGlobal: nativeGlobal,
	resetFederationGlobalInfo: resetFederationGlobalInfo,
	setGlobalFederationInstance: setGlobalFederationInstance,
	getGlobalFederationConstructor: getGlobalFederationConstructor,
	setGlobalFederationConstructor: setGlobalFederationConstructor,
	getInfoWithoutType: getInfoWithoutType,
	getGlobalSnapshot: getGlobalSnapshot,
	getTargetSnapshotInfoByModuleInfo: getTargetSnapshotInfoByModuleInfo,
	getGlobalSnapshotInfoByModuleInfo: getGlobalSnapshotInfoByModuleInfo,
	setGlobalSnapshotInfoByModuleInfo: setGlobalSnapshotInfoByModuleInfo,
	addGlobalSnapshot: addGlobalSnapshot,
	getRemoteEntryExports: getRemoteEntryExports,
	registerGlobalPlugins: registerGlobalPlugins,
	getGlobalHostPlugins: getGlobalHostPlugins,
	getPreloaded: getPreloaded,
	setPreloaded: setPreloaded
};
var helpers_default = {
	global: GlobalUtils,
	share: ShareUtils,
	utils: {
		matchRemoteWithNameAndExpose: matchRemoteWithNameAndExpose,
		preloadAssets: preloadAssets,
		getRemoteInfo: getRemoteInfo
	}
};

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/context.js
//#region src/utils/context.ts
function remoteToEntry(r) {
	return {
		name: r.name,
		alias: r.alias,
		entry: "entry" in r ? r.entry : void 0,
		version: "version" in r ? r.version : void 0,
		type: r.type,
		entryGlobalName: r.entryGlobalName,
		shareScope: r.shareScope
	};
}
/**
* Build a partial MFContext from runtime Options.
* Used to enrich diagnostic entries with host context at error sites.
*/
function optionsToMFContext(options) {
	const shared = {};
	for (const [pkgName, versions] of Object.entries(options.shared)) {
		const first = versions[0];
		if (first) shared[pkgName] = {
			version: first.version,
			singleton: first.shareConfig?.singleton,
			requiredVersion: first.shareConfig?.requiredVersion === false ? false : first.shareConfig?.requiredVersion,
			eager: first.eager,
			strictVersion: first.shareConfig?.strictVersion
		};
	}
	return {
		project: {
			name: options.name,
			mfRole: options.remotes?.length > 0 ? "host" : "unknown"
		},
		mfConfig: {
			name: options.name,
			remotes: options.remotes?.map(remoteToEntry) ?? [],
			shared
		}
	};
}

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/module/index.js








//#region src/module/index.ts
function createRemoteEntryInitOptions(remoteInfo, hostShareScopeMap, rawInitScope) {
	const localShareScopeMap = hostShareScopeMap;
	const shareScopeKeys = Array.isArray(remoteInfo.shareScope) ? remoteInfo.shareScope : [remoteInfo.shareScope];
	if (!shareScopeKeys.length) shareScopeKeys.push("default");
	shareScopeKeys.forEach((shareScopeKey) => {
		if (!localShareScopeMap[shareScopeKey]) localShareScopeMap[shareScopeKey] = {};
	});
	const remoteEntryInitOptions = {
		version: remoteInfo.version || "",
		shareScopeKeys: Array.isArray(remoteInfo.shareScope) ? shareScopeKeys : remoteInfo.shareScope || "default"
	};
	Object.defineProperty(remoteEntryInitOptions, "shareScopeMap", {
		value: localShareScopeMap,
		enumerable: false
	});
	return {
		remoteEntryInitOptions,
		shareScope: localShareScopeMap[shareScopeKeys[0]],
		initScope: rawInitScope ?? []
	};
}
var Module$1 = class {
	constructor({ remoteInfo, host }) {
		this.inited = false;
		this.initing = false;
		this.lib = void 0;
		this.remoteInfo = remoteInfo;
		this.host = host;
	}
	async getEntry() {
		if (this.remoteEntryExports) return this.remoteEntryExports;
		const remoteEntryExports = await getRemoteEntry({
			origin: this.host,
			remoteInfo: this.remoteInfo,
			remoteEntryExports: this.remoteEntryExports
		});
		logger_assert(remoteEntryExports, `remoteEntryExports is undefined \n ${safeToString(this.remoteInfo)}`);
		this.remoteEntryExports = remoteEntryExports;
		return this.remoteEntryExports;
	}
	async init(id, remoteSnapshot, rawInitScope) {
		const remoteEntryExports = await this.getEntry();
		if (this.inited) return remoteEntryExports;
		if (this.initPromise) {
			await this.initPromise;
			return remoteEntryExports;
		}
		this.initing = true;
		this.initPromise = (async () => {
			const { remoteEntryInitOptions, shareScope, initScope } = createRemoteEntryInitOptions(this.remoteInfo, this.host.shareScopeMap, rawInitScope);
			const initContainerOptions = await this.host.hooks.lifecycle.beforeInitContainer.emit({
				shareScope,
				remoteEntryInitOptions,
				initScope,
				remoteInfo: this.remoteInfo,
				origin: this.host
			});
			if (typeof remoteEntryExports?.init === "undefined") logger_error(RUNTIME_002, runtimeDescMap, {
				hostName: this.host.name,
				remoteName: this.remoteInfo.name,
				remoteEntryUrl: this.remoteInfo.entry,
				remoteEntryKey: this.remoteInfo.entryGlobalName
			}, void 0, optionsToMFContext(this.host.options));
			await remoteEntryExports.init(initContainerOptions.shareScope, initContainerOptions.initScope, initContainerOptions.remoteEntryInitOptions);
			await this.host.hooks.lifecycle.initContainer.emit({
				...initContainerOptions,
				id,
				remoteSnapshot,
				remoteEntryExports
			});
			this.inited = true;
		})();
		try {
			await this.initPromise;
		} finally {
			this.initing = false;
			this.initPromise = void 0;
		}
		return remoteEntryExports;
	}
	async get(id, expose, options, remoteSnapshot) {
		const { loadFactory = true } = options || { loadFactory: true };
		const remoteEntryExports = await this.init(id, remoteSnapshot);
		this.lib = remoteEntryExports;
		let moduleFactory;
		moduleFactory = await this.host.loaderHook.lifecycle.getModuleFactory.emit({
			remoteEntryExports,
			expose,
			moduleInfo: this.remoteInfo
		});
		if (!moduleFactory) moduleFactory = await remoteEntryExports.get(expose);
		logger_assert(moduleFactory, `${getFMId(this.remoteInfo)} remote don't export ${expose}.`);
		const symbolName = processModuleAlias(this.remoteInfo.name, expose);
		const wrapModuleFactory = this.wraperFactory(moduleFactory, symbolName);
		if (!loadFactory) return wrapModuleFactory;
		return await wrapModuleFactory();
	}
	wraperFactory(moduleFactory, id) {
		function defineModuleId(res, id) {
			if (res && typeof res === "object" && Object.isExtensible(res) && !Object.getOwnPropertyDescriptor(res, Symbol.for("mf_module_id"))) Object.defineProperty(res, Symbol.for("mf_module_id"), {
				value: id,
				enumerable: false
			});
		}
		if (moduleFactory instanceof Promise) return async () => {
			const res = await moduleFactory();
			defineModuleId(res, id);
			return res;
		};
		else return () => {
			const res = moduleFactory();
			defineModuleId(res, id);
			return res;
		};
	}
};

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/env.js


//#region src/utils/env.ts
function getBuilderId() {
	return  true ? "admin:1.0.0" : 0;
}

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/hooks/syncHook.js
//#region src/utils/hooks/syncHook.ts
var SyncHook = class {
	constructor(type) {
		this.type = "";
		this.listeners = /* @__PURE__ */ new Set();
		if (type) this.type = type;
	}
	on(fn) {
		if (typeof fn === "function") this.listeners.add(fn);
	}
	once(fn) {
		const self = this;
		this.on(function wrapper(...args) {
			self.remove(wrapper);
			return fn.apply(null, args);
		});
	}
	emit(...data) {
		let result;
		if (this.listeners.size > 0) this.listeners.forEach((fn) => {
			result = fn(...data);
		});
		return result;
	}
	remove(fn) {
		this.listeners.delete(fn);
	}
	removeAll() {
		this.listeners.clear();
	}
};

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncHook.js


//#region src/utils/hooks/asyncHook.ts
var AsyncHook = class extends SyncHook {
	emit(...data) {
		let result;
		const ls = Array.from(this.listeners);
		if (ls.length > 0) {
			let i = 0;
			const call = (prev) => {
				if (prev === false) return false;
				else if (i < ls.length) return Promise.resolve(ls[i++].apply(null, data)).then(call);
				else return prev;
			};
			result = call();
		}
		return Promise.resolve(result);
	}
};

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/hooks/syncWaterfallHook.js




//#region src/utils/hooks/syncWaterfallHook.ts
function checkReturnData(originalData, returnedData) {
	if (!isObject(returnedData)) return false;
	if (originalData !== returnedData) {
		for (const key in originalData) if (!(key in returnedData)) return false;
	}
	return true;
}
var SyncWaterfallHook = class extends SyncHook {
	constructor(type) {
		super();
		this.onerror = logger_error;
		this.type = type;
	}
	emit(data) {
		if (!isObject(data)) logger_error(`The data for the "${this.type}" hook should be an object.`);
		for (const fn of this.listeners) try {
			const tempData = fn(data);
			if (checkReturnData(data, tempData)) data = tempData;
			else {
				this.onerror(`A plugin returned an unacceptable value for the "${this.type}" type.`);
				break;
			}
		} catch (e) {
			warn$1(e);
			this.onerror(e);
		}
		return data;
	}
};

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncWaterfallHooks.js





//#region src/utils/hooks/asyncWaterfallHooks.ts
var AsyncWaterfallHook = class extends SyncHook {
	constructor(type) {
		super();
		this.onerror = logger_error;
		this.type = type;
	}
	emit(data) {
		if (!isObject(data)) logger_error(`The response data for the "${this.type}" hook must be an object.`);
		const ls = Array.from(this.listeners);
		if (ls.length > 0) {
			let i = 0;
			const processError = (e) => {
				warn$1(e);
				this.onerror(e);
				return data;
			};
			const call = (prevData) => {
				if (checkReturnData(data, prevData)) {
					data = prevData;
					if (i < ls.length) try {
						return Promise.resolve(ls[i++](data)).then(call, processError);
					} catch (e) {
						return processError(e);
					}
				} else this.onerror(`A plugin returned an incorrect value for the "${this.type}" type.`);
				return data;
			};
			return Promise.resolve(call(data));
		}
		return Promise.resolve(data);
	}
};

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/hooks/pluginSystem.js




//#region src/utils/hooks/pluginSystem.ts
var PluginSystem = class {
	constructor(lifecycle) {
		this.registerPlugins = {};
		this.lifecycle = lifecycle;
		this.lifecycleKeys = Object.keys(lifecycle);
	}
	applyPlugin(plugin, instance) {
		logger_assert(isPlainObject(plugin), "Plugin configuration is invalid.");
		const pluginName = plugin.name;
		logger_assert(pluginName, "A name must be provided by the plugin.");
		if (!this.registerPlugins[pluginName]) {
			this.registerPlugins[pluginName] = plugin;
			plugin.apply?.(instance);
			Object.keys(this.lifecycle).forEach((key) => {
				const pluginLife = plugin[key];
				if (pluginLife) this.lifecycle[key].on(pluginLife);
			});
		}
	}
	removePlugin(pluginName) {
		logger_assert(pluginName, "A name is required.");
		const plugin = this.registerPlugins[pluginName];
		logger_assert(plugin, `The plugin "${pluginName}" is not registered.`);
		Object.keys(plugin).forEach((key) => {
			if (key !== "name") this.lifecycle[key].remove(plugin[key]);
		});
	}
};

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/utils/hooks/index.js







;// ../node_modules/@module-federation/runtime-core/dist/plugins/snapshot/index.js







//#region src/plugins/snapshot/index.ts
function assignRemoteInfo(remoteInfo, remoteSnapshot) {
	const remoteEntryInfo = getRemoteEntryInfoFromSnapshot(remoteSnapshot);
	if (!remoteEntryInfo.url) logger_error(RUNTIME_011, runtimeDescMap, { remoteName: remoteInfo.name });
	let entryUrl = getResourceUrl(remoteSnapshot, remoteEntryInfo.url);
	if (!isBrowserEnvValue && !entryUrl.startsWith("http")) entryUrl = `https:${entryUrl}`;
	remoteInfo.type = remoteEntryInfo.type;
	remoteInfo.entryGlobalName = remoteEntryInfo.globalName;
	remoteInfo.entry = entryUrl;
	remoteInfo.version = remoteSnapshot.version;
	remoteInfo.buildVersion = remoteSnapshot.buildVersion;
}
function snapshotPlugin() {
	return {
		name: "snapshot-plugin",
		async afterResolve(args) {
			const { remote, pkgNameOrAlias, expose, origin, remoteInfo, id } = args;
			if (!isRemoteInfoWithEntry(remote) || !isPureRemoteEntry(remote)) {
				const { remoteSnapshot, globalSnapshot } = await origin.snapshotHandler.loadRemoteSnapshotInfo({
					moduleInfo: remote,
					id
				});
				assignRemoteInfo(remoteInfo, remoteSnapshot);
				const preloadOptions = {
					remote,
					preloadConfig: {
						nameOrAlias: pkgNameOrAlias,
						exposes: [expose],
						resourceCategory: "sync",
						share: false,
						depsRemote: false
					}
				};
				const assets = await origin.remoteHandler.hooks.lifecycle.generatePreloadAssets.emit({
					origin,
					preloadOptions,
					remoteInfo,
					remote,
					remoteSnapshot,
					globalSnapshot
				});
				if (assets) preloadAssets(remoteInfo, origin, assets, false);
				return {
					...args,
					remoteSnapshot
				};
			}
			return args;
		}
	};
}

//#endregion


;// ../node_modules/@module-federation/sdk/dist/generateSnapshotFromManifest.js


//#region src/generateSnapshotFromManifest.ts
const simpleJoinRemoteEntry = (rPath, rName) => {
	if (!rPath) return rName;
	const transformPath = (str) => {
		if (str === ".") return "";
		if (str.startsWith("./")) return str.replace("./", "");
		if (str.startsWith("/")) {
			const strWithoutSlash = str.slice(1);
			if (strWithoutSlash.endsWith("/")) return strWithoutSlash.slice(0, -1);
			return strWithoutSlash;
		}
		return str;
	};
	const transformedPath = transformPath(rPath);
	if (!transformedPath) return rName;
	if (transformedPath.endsWith("/")) return `${transformedPath}${rName}`;
	return `${transformedPath}/${rName}`;
};
function inferAutoPublicPath(url) {
	return url.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
}
function generateSnapshotFromManifest(manifest, options = {}) {
	const { remotes = {}, overrides = {}, version } = options;
	let remoteSnapshot;
	const getPublicPath = () => {
		if ("publicPath" in manifest.metaData) {
			if ((manifest.metaData.publicPath === "auto" || manifest.metaData.publicPath === "") && version) return inferAutoPublicPath(version);
			return manifest.metaData.publicPath;
		} else return manifest.metaData.getPublicPath;
	};
	const overridesKeys = Object.keys(overrides);
	let remotesInfo = {};
	if (!Object.keys(remotes).length) remotesInfo = manifest.remotes?.reduce((res, next) => {
		let matchedVersion;
		const name = next.federationContainerName;
		if (overridesKeys.includes(name)) matchedVersion = overrides[name];
		else if ("version" in next) matchedVersion = next.version;
		else matchedVersion = next.entry;
		res[name] = { matchedVersion };
		return res;
	}, {}) || {};
	Object.keys(remotes).forEach((key) => remotesInfo[key] = { matchedVersion: overridesKeys.includes(key) ? overrides[key] : remotes[key] });
	const { remoteEntry: { path: remoteEntryPath, name: remoteEntryName, type: remoteEntryType }, types: remoteTypes = {
		path: "",
		name: "",
		zip: "",
		api: ""
	}, buildInfo: { buildVersion }, globalName, ssrRemoteEntry } = manifest.metaData;
	const { exposes } = manifest;
	let basicRemoteSnapshot = {
		version: version ? version : "",
		buildVersion,
		globalName,
		remoteEntry: simpleJoinRemoteEntry(remoteEntryPath, remoteEntryName),
		remoteEntryType,
		remoteTypes: simpleJoinRemoteEntry(remoteTypes.path, remoteTypes.name),
		remoteTypesZip: remoteTypes.zip || "",
		remoteTypesAPI: remoteTypes.api || "",
		remotesInfo,
		shared: manifest?.shared.map((item) => ({
			assets: item.assets,
			sharedName: item.name,
			version: item.version,
			usedExports: item.referenceExports || []
		})),
		modules: exposes?.map((expose) => ({
			moduleName: expose.name,
			modulePath: expose.path,
			assets: expose.assets
		}))
	};
	if (manifest.metaData?.prefetchInterface) {
		const prefetchInterface = manifest.metaData.prefetchInterface;
		basicRemoteSnapshot = {
			...basicRemoteSnapshot,
			prefetchInterface
		};
	}
	if (manifest.metaData?.prefetchEntry) {
		const { path, name, type } = manifest.metaData.prefetchEntry;
		basicRemoteSnapshot = {
			...basicRemoteSnapshot,
			prefetchEntry: simpleJoinRemoteEntry(path, name),
			prefetchEntryType: type
		};
	}
	if ("publicPath" in manifest.metaData) {
		remoteSnapshot = {
			...basicRemoteSnapshot,
			publicPath: getPublicPath()
		};
		if (typeof manifest.metaData.ssrPublicPath === "string") remoteSnapshot.ssrPublicPath = manifest.metaData.ssrPublicPath;
	} else remoteSnapshot = {
		...basicRemoteSnapshot,
		getPublicPath: getPublicPath()
	};
	if (ssrRemoteEntry) {
		const fullSSRRemoteEntry = simpleJoinRemoteEntry(ssrRemoteEntry.path, ssrRemoteEntry.name);
		remoteSnapshot.ssrRemoteEntry = fullSSRRemoteEntry;
		remoteSnapshot.ssrRemoteEntryType = ssrRemoteEntry.type || "commonjs-module";
	}
	return remoteSnapshot;
}
function isManifestProvider(moduleInfo) {
	if ("remoteEntry" in moduleInfo && moduleInfo.remoteEntry.includes(MANIFEST_EXT)) return true;
	else return false;
}
function getManifestFileName(manifestOptions) {
	if (!manifestOptions) return {
		statsFileName: StatsFileName,
		manifestFileName: ManifestFileName
	};
	let filePath = typeof manifestOptions === "boolean" ? "" : manifestOptions.filePath || "";
	let fileName = typeof manifestOptions === "boolean" ? "" : manifestOptions.fileName || "";
	const JSON_EXT = ".json";
	const addExt = (name) => {
		if (name.endsWith(JSON_EXT)) return name;
		return `${name}${JSON_EXT}`;
	};
	const insertSuffix = (name, suffix) => {
		return name.replace(JSON_EXT, `${suffix}${JSON_EXT}`);
	};
	const manifestFileName = fileName ? addExt(fileName) : ManifestFileName;
	return {
		statsFileName: simpleJoinRemoteEntry(filePath, fileName ? insertSuffix(manifestFileName, "-stats") : StatsFileName),
		manifestFileName: simpleJoinRemoteEntry(filePath, manifestFileName)
	};
}

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/plugins/generate-preload-assets.js








//#region src/plugins/generate-preload-assets.ts
function splitId(id) {
	const splitInfo = id.split(":");
	if (splitInfo.length === 1) return {
		name: splitInfo[0],
		version: void 0
	};
	else if (splitInfo.length === 2) return {
		name: splitInfo[0],
		version: splitInfo[1]
	};
	else return {
		name: splitInfo[1],
		version: splitInfo[2]
	};
}
function traverseModuleInfo(globalSnapshot, remoteInfo, traverse, isRoot, memo = {}, remoteSnapshot) {
	const { value: snapshotValue } = getInfoWithoutType(globalSnapshot, getFMId(remoteInfo));
	const effectiveRemoteSnapshot = remoteSnapshot || snapshotValue;
	if (effectiveRemoteSnapshot && !isManifestProvider(effectiveRemoteSnapshot)) {
		traverse(effectiveRemoteSnapshot, remoteInfo, isRoot);
		if (effectiveRemoteSnapshot.remotesInfo) {
			const remoteKeys = Object.keys(effectiveRemoteSnapshot.remotesInfo);
			for (const key of remoteKeys) {
				if (memo[key]) continue;
				memo[key] = true;
				const subRemoteInfo = splitId(key);
				const remoteValue = effectiveRemoteSnapshot.remotesInfo[key];
				traverseModuleInfo(globalSnapshot, {
					name: subRemoteInfo.name,
					version: remoteValue.matchedVersion
				}, traverse, false, memo, void 0);
			}
		}
	}
}
const isExisted = (type, url) => {
	return document.querySelector(`${type}[${type === "link" ? "href" : "src"}="${url}"]`);
};
function generatePreloadAssets(origin, preloadOptions, remote, globalSnapshot, remoteSnapshot) {
	const cssAssets = [];
	const jsAssets = [];
	const entryAssets = [];
	const loadedSharedJsAssets = /* @__PURE__ */ new Set();
	const loadedSharedCssAssets = /* @__PURE__ */ new Set();
	const { options } = origin;
	const { preloadConfig: rootPreloadConfig } = preloadOptions;
	const { depsRemote } = rootPreloadConfig;
	traverseModuleInfo(globalSnapshot, remote, (moduleInfoSnapshot, remoteInfo, isRoot) => {
		let preloadConfig;
		if (isRoot) preloadConfig = rootPreloadConfig;
		else if (Array.isArray(depsRemote)) {
			const findPreloadConfig = depsRemote.find((remoteConfig) => {
				if (remoteConfig.nameOrAlias === remoteInfo.name || remoteConfig.nameOrAlias === remoteInfo.alias) return true;
				return false;
			});
			if (!findPreloadConfig) return;
			preloadConfig = defaultPreloadArgs(findPreloadConfig);
		} else if (depsRemote === true) preloadConfig = rootPreloadConfig;
		else return;
		const remoteEntryUrl = getResourceUrl(moduleInfoSnapshot, getRemoteEntryInfoFromSnapshot(moduleInfoSnapshot).url);
		if (remoteEntryUrl) entryAssets.push({
			name: remoteInfo.name,
			moduleInfo: {
				name: remoteInfo.name,
				entry: remoteEntryUrl,
				type: "remoteEntryType" in moduleInfoSnapshot ? moduleInfoSnapshot.remoteEntryType : "global",
				entryGlobalName: "globalName" in moduleInfoSnapshot ? moduleInfoSnapshot.globalName : remoteInfo.name,
				shareScope: "",
				version: "version" in moduleInfoSnapshot ? moduleInfoSnapshot.version : void 0
			},
			url: remoteEntryUrl
		});
		let moduleAssetsInfo = "modules" in moduleInfoSnapshot ? moduleInfoSnapshot.modules : [];
		const normalizedPreloadExposes = normalizePreloadExposes(preloadConfig.exposes);
		if (normalizedPreloadExposes.length && "modules" in moduleInfoSnapshot) moduleAssetsInfo = moduleInfoSnapshot?.modules?.reduce((assets, moduleAssetInfo) => {
			if (normalizedPreloadExposes?.indexOf(moduleAssetInfo.moduleName) !== -1) assets.push(moduleAssetInfo);
			return assets;
		}, []);
		function handleAssets(assets) {
			const assetsRes = assets.map((asset) => getResourceUrl(moduleInfoSnapshot, asset));
			if (preloadConfig.filter) return assetsRes.filter(preloadConfig.filter);
			return assetsRes;
		}
		if (moduleAssetsInfo) {
			const assetsLength = moduleAssetsInfo.length;
			for (let index = 0; index < assetsLength; index++) {
				const assetsInfo = moduleAssetsInfo[index];
				const exposeFullPath = `${remoteInfo.name}/${assetsInfo.moduleName}`;
				origin.remoteHandler.hooks.lifecycle.handlePreloadModule.emit({
					id: assetsInfo.moduleName === "." ? remoteInfo.name : exposeFullPath,
					name: remoteInfo.name,
					remoteSnapshot: moduleInfoSnapshot,
					preloadConfig,
					remote: remoteInfo,
					origin
				});
				if (getPreloaded(exposeFullPath)) continue;
				if (preloadConfig.resourceCategory === "all") {
					cssAssets.push(...handleAssets(assetsInfo.assets.css.async));
					cssAssets.push(...handleAssets(assetsInfo.assets.css.sync));
					jsAssets.push(...handleAssets(assetsInfo.assets.js.async));
					jsAssets.push(...handleAssets(assetsInfo.assets.js.sync));
				} else if (preloadConfig.resourceCategory === "sync") {
					cssAssets.push(...handleAssets(assetsInfo.assets.css.sync));
					jsAssets.push(...handleAssets(assetsInfo.assets.js.sync));
				}
				setPreloaded(exposeFullPath);
			}
		}
	}, true, {}, remoteSnapshot);
	if (remoteSnapshot.shared && remoteSnapshot.shared.length > 0) {
		const collectSharedAssets = (shareInfo, snapshotShared) => {
			const { shared: registeredShared } = getRegisteredShare(origin.shareScopeMap, snapshotShared.sharedName, shareInfo, origin.sharedHandler.hooks.lifecycle.resolveShare) || {};
			if (registeredShared && typeof registeredShared.lib === "function") {
				snapshotShared.assets.js.sync.forEach((asset) => {
					loadedSharedJsAssets.add(asset);
				});
				snapshotShared.assets.css.sync.forEach((asset) => {
					loadedSharedCssAssets.add(asset);
				});
			}
		};
		remoteSnapshot.shared.forEach((shared) => {
			const shareInfos = options.shared?.[shared.sharedName];
			if (!shareInfos) return;
			const sharedOptions = shared.version ? shareInfos.find((s) => s.version === shared.version) : shareInfos;
			if (!sharedOptions) return;
			arrayOptions(sharedOptions).forEach((s) => {
				collectSharedAssets(s, shared);
			});
		});
	}
	const needPreloadJsAssets = jsAssets.filter((asset) => !loadedSharedJsAssets.has(asset) && !isExisted("script", asset));
	return {
		cssAssets: cssAssets.filter((asset) => !loadedSharedCssAssets.has(asset) && !isExisted("link", asset)),
		jsAssetsWithoutEntry: needPreloadJsAssets,
		entryAssets: entryAssets.filter((entry) => !isExisted("script", entry.url))
	};
}
const generatePreloadAssetsPlugin = function() {
	return {
		name: "generate-preload-assets-plugin",
		async generatePreloadAssets(args) {
			const { origin, preloadOptions, remoteInfo, remote, globalSnapshot, remoteSnapshot } = args;
			if (!isBrowserEnvValue) return {
				cssAssets: [],
				jsAssetsWithoutEntry: [],
				entryAssets: []
			};
			if (isRemoteInfoWithEntry(remote) && isPureRemoteEntry(remote)) return {
				cssAssets: [],
				jsAssetsWithoutEntry: [],
				entryAssets: [{
					name: remote.name,
					url: remote.entry,
					moduleInfo: {
						name: remoteInfo.name,
						entry: remote.entry,
						type: remoteInfo.type || "global",
						entryGlobalName: "",
						shareScope: ""
					}
				}]
			};
			assignRemoteInfo(remoteInfo, remoteSnapshot);
			return generatePreloadAssets(origin, preloadOptions, remoteInfo, globalSnapshot, remoteSnapshot);
		}
	};
};

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/plugins/snapshot/SnapshotHandler.js













//#region src/plugins/snapshot/SnapshotHandler.ts
function getGlobalRemoteInfo(moduleInfo, origin) {
	const hostGlobalSnapshot = getGlobalSnapshotInfoByModuleInfo({
		name: origin.name,
		version: origin.options.version
	});
	const globalRemoteInfo = hostGlobalSnapshot && "remotesInfo" in hostGlobalSnapshot && hostGlobalSnapshot.remotesInfo && getInfoWithoutType(hostGlobalSnapshot.remotesInfo, moduleInfo.name).value;
	if (globalRemoteInfo && globalRemoteInfo.matchedVersion) return {
		hostGlobalSnapshot,
		globalSnapshot: getGlobalSnapshot(),
		remoteSnapshot: getGlobalSnapshotInfoByModuleInfo({
			name: moduleInfo.name,
			version: globalRemoteInfo.matchedVersion
		})
	};
	return {
		hostGlobalSnapshot: void 0,
		globalSnapshot: getGlobalSnapshot(),
		remoteSnapshot: getGlobalSnapshotInfoByModuleInfo({
			name: moduleInfo.name,
			version: "version" in moduleInfo ? moduleInfo.version : void 0
		})
	};
}
var SnapshotHandler = class {
	constructor(HostInstance) {
		this.loadingHostSnapshot = null;
		this.manifestCache = /* @__PURE__ */ new Map();
		this.hooks = new PluginSystem({
			beforeLoadRemoteSnapshot: new AsyncHook("beforeLoadRemoteSnapshot"),
			loadSnapshot: new AsyncWaterfallHook("loadGlobalSnapshot"),
			loadRemoteSnapshot: new AsyncWaterfallHook("loadRemoteSnapshot"),
			afterLoadSnapshot: new AsyncWaterfallHook("afterLoadSnapshot")
		});
		this.manifestLoading = Global.__FEDERATION__.__MANIFEST_LOADING__;
		this.HostInstance = HostInstance;
		this.loaderHook = HostInstance.loaderHook;
	}
	async loadRemoteSnapshotInfo({ moduleInfo, id, expose }) {
		const { options } = this.HostInstance;
		await this.hooks.lifecycle.beforeLoadRemoteSnapshot.emit({
			options,
			moduleInfo
		});
		let hostSnapshot = getGlobalSnapshotInfoByModuleInfo({
			name: this.HostInstance.options.name,
			version: this.HostInstance.options.version
		});
		if (!hostSnapshot) {
			hostSnapshot = {
				version: this.HostInstance.options.version || "",
				remoteEntry: "",
				remotesInfo: {}
			};
			addGlobalSnapshot({ [this.HostInstance.options.name]: hostSnapshot });
		}
		if (hostSnapshot && "remotesInfo" in hostSnapshot && !getInfoWithoutType(hostSnapshot.remotesInfo, moduleInfo.name).value) {
			if ("version" in moduleInfo || "entry" in moduleInfo) hostSnapshot.remotesInfo = {
				...hostSnapshot?.remotesInfo,
				[moduleInfo.name]: { matchedVersion: "version" in moduleInfo ? moduleInfo.version : moduleInfo.entry }
			};
		}
		const { hostGlobalSnapshot, remoteSnapshot, globalSnapshot } = this.getGlobalRemoteInfo(moduleInfo);
		const { remoteSnapshot: globalRemoteSnapshot, globalSnapshot: globalSnapshotRes } = await this.hooks.lifecycle.loadSnapshot.emit({
			options,
			moduleInfo,
			hostGlobalSnapshot,
			remoteSnapshot,
			globalSnapshot
		});
		let mSnapshot;
		let gSnapshot;
		if (globalRemoteSnapshot) if (isManifestProvider(globalRemoteSnapshot)) {
			const remoteEntry = isBrowserEnvValue ? globalRemoteSnapshot.remoteEntry : globalRemoteSnapshot.ssrRemoteEntry || globalRemoteSnapshot.remoteEntry || "";
			const moduleSnapshot = await this.getManifestJson(remoteEntry, moduleInfo, {});
			const globalSnapshotRes = setGlobalSnapshotInfoByModuleInfo({
				...moduleInfo,
				entry: remoteEntry
			}, moduleSnapshot);
			mSnapshot = moduleSnapshot;
			gSnapshot = globalSnapshotRes;
		} else {
			const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
				options: this.HostInstance.options,
				moduleInfo,
				remoteSnapshot: globalRemoteSnapshot,
				from: "global"
			});
			mSnapshot = remoteSnapshotRes;
			gSnapshot = globalSnapshotRes;
		}
		else if (isRemoteInfoWithEntry(moduleInfo)) {
			const moduleSnapshot = await this.getManifestJson(moduleInfo.entry, moduleInfo, {});
			const globalSnapshotRes = setGlobalSnapshotInfoByModuleInfo(moduleInfo, moduleSnapshot);
			const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
				options: this.HostInstance.options,
				moduleInfo,
				remoteSnapshot: moduleSnapshot,
				from: "global"
			});
			mSnapshot = remoteSnapshotRes;
			gSnapshot = globalSnapshotRes;
		} else logger_error(RUNTIME_007, runtimeDescMap, {
			remoteName: moduleInfo.name,
			remoteVersion: moduleInfo.version,
			hostName: this.HostInstance.options.name,
			globalSnapshot: JSON.stringify(globalSnapshotRes)
		}, void 0, optionsToMFContext(this.HostInstance.options));
		await this.hooks.lifecycle.afterLoadSnapshot.emit({
			id,
			host: this.HostInstance,
			options,
			moduleInfo,
			remoteSnapshot: mSnapshot
		});
		return {
			remoteSnapshot: mSnapshot,
			globalSnapshot: gSnapshot
		};
	}
	getGlobalRemoteInfo(moduleInfo) {
		return getGlobalRemoteInfo(moduleInfo, this.HostInstance);
	}
	async getManifestJson(manifestUrl, moduleInfo, extraOptions) {
		const getManifest = async () => {
			let manifestJson = this.manifestCache.get(manifestUrl);
			if (manifestJson) return manifestJson;
			try {
				let res = await this.loaderHook.lifecycle.fetch.emit(manifestUrl, {}, getRemoteInfo(moduleInfo));
				if (!res || !(res instanceof Response)) res = await fetch(manifestUrl, {});
				manifestJson = await res.json();
			} catch (err) {
				manifestJson = await this.HostInstance.remoteHandler.hooks.lifecycle.errorLoadRemote.emit({
					id: manifestUrl,
					error: err,
					from: "runtime",
					lifecycle: "afterResolve",
					origin: this.HostInstance
				});
				if (!manifestJson) {
					delete this.manifestLoading[manifestUrl];
					logger_error(RUNTIME_003, runtimeDescMap, {
						manifestUrl,
						moduleName: moduleInfo.name,
						hostName: this.HostInstance.options.name
					}, `${err}`, optionsToMFContext(this.HostInstance.options));
				}
			}
			logger_assert(manifestJson.metaData && manifestJson.exposes && manifestJson.shared, `"${manifestUrl}" is not a valid federation manifest for remote "${moduleInfo.name}". Missing required fields: ${[
				!manifestJson.metaData && "metaData",
				!manifestJson.exposes && "exposes",
				!manifestJson.shared && "shared"
			].filter(Boolean).join(", ")}.`);
			this.manifestCache.set(manifestUrl, manifestJson);
			return manifestJson;
		};
		const asyncLoadProcess = async () => {
			const manifestJson = await getManifest();
			const remoteSnapshot = generateSnapshotFromManifest(manifestJson, { version: manifestUrl });
			const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
				options: this.HostInstance.options,
				moduleInfo,
				manifestJson,
				remoteSnapshot,
				manifestUrl,
				from: "manifest"
			});
			return remoteSnapshotRes;
		};
		if (!this.manifestLoading[manifestUrl]) this.manifestLoading[manifestUrl] = asyncLoadProcess().then((res) => res);
		return this.manifestLoading[manifestUrl];
	}
};

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/shared/index.js












//#region src/shared/index.ts
var SharedHandler = class {
	constructor(host) {
		this.hooks = new PluginSystem({
			beforeRegisterShare: new SyncWaterfallHook("beforeRegisterShare"),
			afterResolve: new AsyncWaterfallHook("afterResolve"),
			beforeLoadShare: new AsyncWaterfallHook("beforeLoadShare"),
			loadShare: new AsyncHook(),
			resolveShare: new SyncWaterfallHook("resolveShare"),
			initContainerShareScopeMap: new SyncWaterfallHook("initContainerShareScopeMap")
		});
		this.host = host;
		this.shareScopeMap = {};
		this.initTokens = {};
		this._setGlobalShareScopeMap(host.options);
	}
	registerShared(globalOptions, userOptions) {
		const { newShareInfos, allShareInfos } = formatShareConfigs(globalOptions, userOptions);
		Object.keys(newShareInfos).forEach((sharedKey) => {
			newShareInfos[sharedKey].forEach((sharedVal) => {
				sharedVal.scope.forEach((sc) => {
					this.hooks.lifecycle.beforeRegisterShare.emit({
						origin: this.host,
						pkgName: sharedKey,
						shared: sharedVal
					});
					if (!this.shareScopeMap[sc]?.[sharedKey]) this.setShared({
						pkgName: sharedKey,
						lib: sharedVal.lib,
						get: sharedVal.get,
						loaded: sharedVal.loaded || Boolean(sharedVal.lib),
						shared: sharedVal,
						from: userOptions.name
					});
				});
			});
		});
		return {
			newShareInfos,
			allShareInfos
		};
	}
	async loadShare(pkgName, extraOptions) {
		const { host } = this;
		const shareOptions = getTargetSharedOptions({
			pkgName,
			extraOptions,
			shareInfos: host.options.shared
		});
		if (shareOptions?.scope) await Promise.all(shareOptions.scope.map(async (shareScope) => {
			await Promise.all(this.initializeSharing(shareScope, { strategy: shareOptions.strategy }));
		}));
		const { shareInfo: shareOptionsRes } = await this.hooks.lifecycle.beforeLoadShare.emit({
			pkgName,
			shareInfo: shareOptions,
			shared: host.options.shared,
			origin: host
		});
		logger_assert(shareOptionsRes, `Cannot find shared "${pkgName}" in host "${host.options.name}". Ensure the shared config for "${pkgName}" is declared in the federation plugin options and the host has been initialized before loading shares.`);
		const { shared: registeredShared, useTreesShaking } = getRegisteredShare(this.shareScopeMap, pkgName, shareOptionsRes, this.hooks.lifecycle.resolveShare) || {};
		if (registeredShared) {
			const targetShared = directShare(registeredShared, useTreesShaking);
			if (targetShared.lib) {
				addUseIn(targetShared, host.options.name);
				return targetShared.lib;
			} else if (targetShared.loading && !targetShared.loaded) {
				const factory = await targetShared.loading;
				targetShared.loaded = true;
				if (!targetShared.lib) targetShared.lib = factory;
				addUseIn(targetShared, host.options.name);
				return factory;
			} else {
				const asyncLoadProcess = async () => {
					const factory = await targetShared.get();
					addUseIn(targetShared, host.options.name);
					targetShared.loaded = true;
					targetShared.lib = factory;
					return factory;
				};
				const loading = asyncLoadProcess();
				this.setShared({
					pkgName,
					loaded: false,
					shared: registeredShared,
					from: host.options.name,
					lib: null,
					loading,
					treeShaking: useTreesShaking ? targetShared : void 0
				});
				return loading;
			}
		} else {
			if (extraOptions?.customShareInfo) return false;
			const _useTreeShaking = shouldUseTreeShaking(shareOptionsRes.treeShaking);
			const targetShared = directShare(shareOptionsRes, _useTreeShaking);
			const asyncLoadProcess = async () => {
				const factory = await targetShared.get();
				targetShared.lib = factory;
				targetShared.loaded = true;
				addUseIn(targetShared, host.options.name);
				const { shared: gShared, useTreesShaking: gUseTreeShaking } = getRegisteredShare(this.shareScopeMap, pkgName, shareOptionsRes, this.hooks.lifecycle.resolveShare) || {};
				if (gShared) {
					const targetGShared = directShare(gShared, gUseTreeShaking);
					targetGShared.lib = factory;
					targetGShared.loaded = true;
					gShared.from = shareOptionsRes.from;
				}
				return factory;
			};
			const loading = asyncLoadProcess();
			this.setShared({
				pkgName,
				loaded: false,
				shared: shareOptionsRes,
				from: host.options.name,
				lib: null,
				loading,
				treeShaking: _useTreeShaking ? targetShared : void 0
			});
			return loading;
		}
	}
	/**
	* This function initializes the sharing sequence (executed only once per share scope).
	* It accepts one argument, the name of the share scope.
	* If the share scope does not exist, it creates one.
	*/
	initializeSharing(shareScopeName = DEFAULT_SCOPE, extraOptions) {
		const { host } = this;
		const from = extraOptions?.from;
		const strategy = extraOptions?.strategy;
		let initScope = extraOptions?.initScope;
		const promises = [];
		if (from !== "build") {
			const { initTokens } = this;
			if (!initScope) initScope = [];
			let initToken = initTokens[shareScopeName];
			if (!initToken) initToken = initTokens[shareScopeName] = { from: this.host.name };
			if (initScope.indexOf(initToken) >= 0) return promises;
			initScope.push(initToken);
		}
		const shareScope = this.shareScopeMap;
		const hostName = host.options.name;
		if (!shareScope[shareScopeName]) shareScope[shareScopeName] = {};
		const scope = shareScope[shareScopeName];
		const register = (name, shared) => {
			const { version, eager } = shared;
			scope[name] = scope[name] || {};
			const versions = scope[name];
			const activeVersion = versions[version] && directShare(versions[version]);
			const activeVersionEager = Boolean(activeVersion && ("eager" in activeVersion && activeVersion.eager || "shareConfig" in activeVersion && activeVersion.shareConfig?.eager));
			if (!activeVersion || activeVersion.strategy !== "loaded-first" && !activeVersion.loaded && (Boolean(!eager) !== !activeVersionEager ? eager : hostName > versions[version].from)) versions[version] = shared;
		};
		const initRemoteModule = async (key) => {
			const { module } = await host.remoteHandler.getRemoteModuleAndOptions({ id: key });
			let remoteEntryExports = void 0;
			try {
				remoteEntryExports = await module.getEntry();
			} catch (error) {
				remoteEntryExports = await host.remoteHandler.hooks.lifecycle.errorLoadRemote.emit({
					id: key,
					error,
					from: "runtime",
					lifecycle: "beforeLoadShare",
					origin: host
				});
				if (!remoteEntryExports) return;
			} finally {
				if (remoteEntryExports?.init && !module.initing) {
					module.remoteEntryExports = remoteEntryExports;
					await module.init(void 0, void 0, initScope);
				}
			}
		};
		Object.keys(host.options.shared).forEach((shareName) => {
			host.options.shared[shareName].forEach((shared) => {
				if (shared.scope.includes(shareScopeName)) register(shareName, shared);
			});
		});
		if (host.options.shareStrategy === "version-first" || strategy === "version-first") host.options.remotes.forEach((remote) => {
			if (remote.shareScope === shareScopeName) promises.push(initRemoteModule(remote.name));
		});
		return promises;
	}
	loadShareSync(pkgName, extraOptions) {
		const { host } = this;
		const shareOptions = getTargetSharedOptions({
			pkgName,
			extraOptions,
			shareInfos: host.options.shared
		});
		if (shareOptions?.scope) shareOptions.scope.forEach((shareScope) => {
			this.initializeSharing(shareScope, { strategy: shareOptions.strategy });
		});
		const { shared: registeredShared, useTreesShaking } = getRegisteredShare(this.shareScopeMap, pkgName, shareOptions, this.hooks.lifecycle.resolveShare) || {};
		if (registeredShared) {
			if (typeof registeredShared.lib === "function") {
				addUseIn(registeredShared, host.options.name);
				if (!registeredShared.loaded) {
					registeredShared.loaded = true;
					if (registeredShared.from === host.options.name) shareOptions.loaded = true;
				}
				return registeredShared.lib;
			}
			if (typeof registeredShared.get === "function") {
				const module = registeredShared.get();
				if (!(module instanceof Promise)) {
					addUseIn(registeredShared, host.options.name);
					this.setShared({
						pkgName,
						loaded: true,
						from: host.options.name,
						lib: module,
						shared: registeredShared
					});
					return module;
				}
			}
		}
		if (shareOptions.lib) {
			if (!shareOptions.loaded) shareOptions.loaded = true;
			return shareOptions.lib;
		}
		if (shareOptions.get) {
			const module = shareOptions.get();
			if (module instanceof Promise) logger_error(extraOptions?.from === "build" ? RUNTIME_005 : RUNTIME_006, runtimeDescMap, {
				hostName: host.options.name,
				sharedPkgName: pkgName
			}, void 0, optionsToMFContext(host.options));
			shareOptions.lib = module;
			this.setShared({
				pkgName,
				loaded: true,
				from: host.options.name,
				lib: shareOptions.lib,
				shared: shareOptions
			});
			return shareOptions.lib;
		}
		logger_error(RUNTIME_006, runtimeDescMap, {
			hostName: host.options.name,
			sharedPkgName: pkgName
		}, void 0, optionsToMFContext(host.options));
	}
	initShareScopeMap(scopeName, shareScope, extraOptions = {}) {
		const { host } = this;
		this.shareScopeMap[scopeName] = shareScope;
		this.hooks.lifecycle.initContainerShareScopeMap.emit({
			shareScope,
			options: host.options,
			origin: host,
			scopeName,
			hostShareScopeMap: extraOptions.hostShareScopeMap
		});
	}
	setShared({ pkgName, shared, from, lib, loading, loaded, get, treeShaking }) {
		const { version, scope = "default", ...shareInfo } = shared;
		const scopes = Array.isArray(scope) ? scope : [scope];
		const mergeAttrs = (shared) => {
			const merge = (s, key, val) => {
				if (val && !s[key]) s[key] = val;
			};
			const targetShared = treeShaking ? shared.treeShaking : shared;
			merge(targetShared, "loaded", loaded);
			merge(targetShared, "loading", loading);
			merge(targetShared, "get", get);
		};
		scopes.forEach((sc) => {
			if (!this.shareScopeMap[sc]) this.shareScopeMap[sc] = {};
			if (!this.shareScopeMap[sc][pkgName]) this.shareScopeMap[sc][pkgName] = {};
			if (!this.shareScopeMap[sc][pkgName][version]) this.shareScopeMap[sc][pkgName][version] = {
				version,
				scope: [sc],
				...shareInfo,
				lib
			};
			const registeredShared = this.shareScopeMap[sc][pkgName][version];
			mergeAttrs(registeredShared);
			if (from && registeredShared.from !== from) registeredShared.from = from;
		});
	}
	_setGlobalShareScopeMap(hostOptions) {
		const globalShareScopeMap = getGlobalShareScope();
		const identifier = hostOptions.id || hostOptions.name;
		if (identifier && !globalShareScopeMap[identifier]) globalShareScopeMap[identifier] = this.shareScopeMap;
	}
};

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/remote/index.js




















//#region src/remote/index.ts
var RemoteHandler = class {
	constructor(host) {
		this.hooks = new PluginSystem({
			beforeRegisterRemote: new SyncWaterfallHook("beforeRegisterRemote"),
			registerRemote: new SyncWaterfallHook("registerRemote"),
			beforeRequest: new AsyncWaterfallHook("beforeRequest"),
			onLoad: new AsyncHook("onLoad"),
			handlePreloadModule: new SyncHook("handlePreloadModule"),
			errorLoadRemote: new AsyncHook("errorLoadRemote"),
			beforePreloadRemote: new AsyncHook("beforePreloadRemote"),
			generatePreloadAssets: new AsyncHook("generatePreloadAssets"),
			afterPreloadRemote: new AsyncHook(),
			loadEntry: new AsyncHook()
		});
		this.host = host;
		this.idToRemoteMap = {};
	}
	formatAndRegisterRemote(globalOptions, userOptions) {
		return (userOptions.remotes || []).reduce((res, remote) => {
			this.registerRemote(remote, res, { force: false });
			return res;
		}, globalOptions.remotes);
	}
	setIdToRemoteMap(id, remoteMatchInfo) {
		const { remote, expose } = remoteMatchInfo;
		const { name, alias } = remote;
		this.idToRemoteMap[id] = {
			name: remote.name,
			expose
		};
		if (alias && id.startsWith(name)) {
			const idWithAlias = id.replace(name, alias);
			this.idToRemoteMap[idWithAlias] = {
				name: remote.name,
				expose
			};
			return;
		}
		if (alias && id.startsWith(alias)) {
			const idWithName = id.replace(alias, name);
			this.idToRemoteMap[idWithName] = {
				name: remote.name,
				expose
			};
		}
	}
	async loadRemote(id, options) {
		const { host } = this;
		try {
			const { loadFactory = true } = options || { loadFactory: true };
			const { module, moduleOptions, remoteMatchInfo } = await this.getRemoteModuleAndOptions({ id });
			const { pkgNameOrAlias, remote, expose, id: idRes, remoteSnapshot } = remoteMatchInfo;
			const moduleOrFactory = await module.get(idRes, expose, options, remoteSnapshot);
			const moduleWrapper = await this.hooks.lifecycle.onLoad.emit({
				id: idRes,
				pkgNameOrAlias,
				expose,
				exposeModule: loadFactory ? moduleOrFactory : void 0,
				exposeModuleFactory: loadFactory ? void 0 : moduleOrFactory,
				remote,
				options: moduleOptions,
				moduleInstance: module,
				origin: host
			});
			this.setIdToRemoteMap(id, remoteMatchInfo);
			if (typeof moduleWrapper === "function") return moduleWrapper;
			return moduleOrFactory;
		} catch (error) {
			const { from = "runtime" } = options || { from: "runtime" };
			const failOver = await this.hooks.lifecycle.errorLoadRemote.emit({
				id,
				error,
				from,
				lifecycle: "onLoad",
				origin: host
			});
			if (!failOver) throw error;
			return failOver;
		}
	}
	async preloadRemote(preloadOptions) {
		const { host } = this;
		await this.hooks.lifecycle.beforePreloadRemote.emit({
			preloadOps: preloadOptions,
			options: host.options,
			origin: host
		});
		const preloadOps = formatPreloadArgs(host.options.remotes, preloadOptions);
		await Promise.all(preloadOps.map(async (ops) => {
			const { remote } = ops;
			const remoteInfo = getRemoteInfo(remote);
			const { globalSnapshot, remoteSnapshot } = await host.snapshotHandler.loadRemoteSnapshotInfo({ moduleInfo: remote });
			const assets = await this.hooks.lifecycle.generatePreloadAssets.emit({
				origin: host,
				preloadOptions: ops,
				remote,
				remoteInfo,
				globalSnapshot,
				remoteSnapshot
			});
			if (!assets) return;
			preloadAssets(remoteInfo, host, assets);
		}));
	}
	registerRemotes(remotes, options) {
		const { host } = this;
		remotes.forEach((remote) => {
			this.registerRemote(remote, host.options.remotes, { force: options?.force });
		});
	}
	async getRemoteModuleAndOptions(options) {
		const { host } = this;
		const { id } = options;
		let loadRemoteArgs;
		try {
			loadRemoteArgs = await this.hooks.lifecycle.beforeRequest.emit({
				id,
				options: host.options,
				origin: host
			});
		} catch (error) {
			loadRemoteArgs = await this.hooks.lifecycle.errorLoadRemote.emit({
				id,
				options: host.options,
				origin: host,
				from: "runtime",
				error,
				lifecycle: "beforeRequest"
			});
			if (!loadRemoteArgs) throw error;
		}
		const { id: idRes } = loadRemoteArgs;
		const remoteSplitInfo = matchRemoteWithNameAndExpose(host.options.remotes, idRes);
		if (!remoteSplitInfo) logger_error(RUNTIME_004, runtimeDescMap, {
			hostName: host.options.name,
			requestId: idRes
		}, void 0, optionsToMFContext(host.options));
		const { remote: rawRemote } = remoteSplitInfo;
		const remoteInfo = getRemoteInfo(rawRemote);
		const matchInfo = await host.sharedHandler.hooks.lifecycle.afterResolve.emit({
			id: idRes,
			...remoteSplitInfo,
			options: host.options,
			origin: host,
			remoteInfo
		});
		const { remote, expose } = matchInfo;
		logger_assert(remote && expose, `The 'beforeRequest' hook was executed, but it failed to return the correct 'remote' and 'expose' values while loading ${idRes}.`);
		let module = host.moduleCache.get(remote.name);
		const moduleOptions = {
			host,
			remoteInfo
		};
		if (!module) {
			module = new Module$1(moduleOptions);
			host.moduleCache.set(remote.name, module);
		}
		return {
			module,
			moduleOptions,
			remoteMatchInfo: matchInfo
		};
	}
	registerRemote(remote, targetRemotes, options) {
		const { host } = this;
		const normalizeRemote = () => {
			if (remote.alias) {
				const findEqual = targetRemotes.find((item) => remote.alias && (item.name.startsWith(remote.alias) || item.alias?.startsWith(remote.alias)));
				logger_assert(!findEqual, `The alias ${remote.alias} of remote ${remote.name} is not allowed to be the prefix of ${findEqual && findEqual.name} name or alias`);
			}
			if ("entry" in remote) {
				if (isBrowserEnvValue && typeof window !== "undefined" && !remote.entry.startsWith("http")) remote.entry = new URL(remote.entry, window.location.origin).href;
			}
			if (!remote.shareScope) remote.shareScope = DEFAULT_SCOPE;
			if (!remote.type) remote.type = DEFAULT_REMOTE_TYPE;
		};
		this.hooks.lifecycle.beforeRegisterRemote.emit({
			remote,
			origin: host
		});
		const registeredRemote = targetRemotes.find((item) => item.name === remote.name);
		if (!registeredRemote) {
			normalizeRemote();
			targetRemotes.push(remote);
			this.hooks.lifecycle.registerRemote.emit({
				remote,
				origin: host
			});
		} else {
			const messages = [`The remote "${remote.name}" is already registered.`, "Please note that overriding it may cause unexpected errors."];
			if (options?.force) {
				this.removeRemote(registeredRemote);
				normalizeRemote();
				targetRemotes.push(remote);
				this.hooks.lifecycle.registerRemote.emit({
					remote,
					origin: host
				});
				warn(messages.join(" "));
			}
		}
	}
	removeRemote(remote) {
		try {
			const { host } = this;
			const { name } = remote;
			const remoteIndex = host.options.remotes.findIndex((item) => item.name === name);
			if (remoteIndex !== -1) host.options.remotes.splice(remoteIndex, 1);
			const loadedModule = host.moduleCache.get(remote.name);
			if (loadedModule) {
				const remoteInfo = loadedModule.remoteInfo;
				const key = remoteInfo.entryGlobalName;
				if (CurrentGlobal[key]) if (Object.getOwnPropertyDescriptor(CurrentGlobal, key)?.configurable) delete CurrentGlobal[key];
				else CurrentGlobal[key] = void 0;
				const remoteEntryUniqueKey = getRemoteEntryUniqueKey(loadedModule.remoteInfo);
				if (globalLoading[remoteEntryUniqueKey]) delete globalLoading[remoteEntryUniqueKey];
				host.snapshotHandler.manifestCache.delete(remoteInfo.entry);
				let remoteInsId = remoteInfo.buildVersion ? composeKeyWithSeparator(remoteInfo.name, remoteInfo.buildVersion) : remoteInfo.name;
				const remoteInsIndex = CurrentGlobal.__FEDERATION__.__INSTANCES__.findIndex((ins) => {
					if (remoteInfo.buildVersion) return ins.options.id === remoteInsId;
					else return ins.name === remoteInsId;
				});
				if (remoteInsIndex !== -1) {
					const remoteIns = CurrentGlobal.__FEDERATION__.__INSTANCES__[remoteInsIndex];
					remoteInsId = remoteIns.options.id || remoteInsId;
					const globalShareScopeMap = getGlobalShareScope();
					let isAllSharedNotUsed = true;
					const needDeleteKeys = [];
					Object.keys(globalShareScopeMap).forEach((instId) => {
						const shareScopeMap = globalShareScopeMap[instId];
						shareScopeMap && Object.keys(shareScopeMap).forEach((shareScope) => {
							const shareScopeVal = shareScopeMap[shareScope];
							shareScopeVal && Object.keys(shareScopeVal).forEach((shareName) => {
								const sharedPkgs = shareScopeVal[shareName];
								sharedPkgs && Object.keys(sharedPkgs).forEach((shareVersion) => {
									const shared = sharedPkgs[shareVersion];
									if (shared && typeof shared === "object" && shared.from === remoteInfo.name) if (shared.loaded || shared.loading) {
										shared.useIn = shared.useIn.filter((usedHostName) => usedHostName !== remoteInfo.name);
										if (shared.useIn.length) isAllSharedNotUsed = false;
										else needDeleteKeys.push([
											instId,
											shareScope,
											shareName,
											shareVersion
										]);
									} else needDeleteKeys.push([
										instId,
										shareScope,
										shareName,
										shareVersion
									]);
								});
							});
						});
					});
					if (isAllSharedNotUsed) {
						remoteIns.shareScopeMap = {};
						delete globalShareScopeMap[remoteInsId];
					}
					needDeleteKeys.forEach(([insId, shareScope, shareName, shareVersion]) => {
						delete globalShareScopeMap[insId]?.[shareScope]?.[shareName]?.[shareVersion];
					});
					CurrentGlobal.__FEDERATION__.__INSTANCES__.splice(remoteInsIndex, 1);
				}
				const { hostGlobalSnapshot } = getGlobalRemoteInfo(remote, host);
				if (hostGlobalSnapshot) {
					const remoteKey = hostGlobalSnapshot && "remotesInfo" in hostGlobalSnapshot && hostGlobalSnapshot.remotesInfo && getInfoWithoutType(hostGlobalSnapshot.remotesInfo, remote.name).key;
					if (remoteKey) {
						delete hostGlobalSnapshot.remotesInfo[remoteKey];
						if (Boolean(Global.__FEDERATION__.__MANIFEST_LOADING__[remoteKey])) delete Global.__FEDERATION__.__MANIFEST_LOADING__[remoteKey];
					}
				}
				host.moduleCache.delete(remote.name);
			}
		} catch (err) {
			logger_logger.error(`removeRemote failed: ${err instanceof Error ? err.message : String(err)}`);
		}
	}
};

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/core.js






















//#region src/core.ts
const USE_SNAPSHOT =  true ? !false : 0;
var ModuleFederation = class {
	constructor(userOptions) {
		this.hooks = new PluginSystem({
			beforeInit: new SyncWaterfallHook("beforeInit"),
			init: new SyncHook(),
			beforeInitContainer: new AsyncWaterfallHook("beforeInitContainer"),
			initContainer: new AsyncWaterfallHook("initContainer")
		});
		this.version = "2.3.3";
		this.moduleCache = /* @__PURE__ */ new Map();
		this.loaderHook = new PluginSystem({
			getModuleInfo: new SyncHook(),
			createScript: new SyncHook(),
			createLink: new SyncHook(),
			fetch: new AsyncHook(),
			loadEntryError: new AsyncHook(),
			getModuleFactory: new AsyncHook()
		});
		this.bridgeHook = new PluginSystem({
			beforeBridgeRender: new SyncHook(),
			afterBridgeRender: new SyncHook(),
			beforeBridgeDestroy: new SyncHook(),
			afterBridgeDestroy: new SyncHook()
		});
		const plugins = USE_SNAPSHOT ? [snapshotPlugin(), generatePreloadAssetsPlugin()] : [];
		const defaultOptions = {
			id: getBuilderId(),
			name: userOptions.name,
			plugins,
			remotes: [],
			shared: {},
			inBrowser: isBrowserEnvValue
		};
		this.name = userOptions.name;
		this.options = defaultOptions;
		this.snapshotHandler = new SnapshotHandler(this);
		this.sharedHandler = new SharedHandler(this);
		this.remoteHandler = new RemoteHandler(this);
		this.shareScopeMap = this.sharedHandler.shareScopeMap;
		this.registerPlugins([...defaultOptions.plugins, ...userOptions.plugins || []]);
		this.options = this.formatOptions(defaultOptions, userOptions);
	}
	initOptions(userOptions) {
		if (userOptions.name && userOptions.name !== this.options.name) logger_error(getShortErrorMsg_getShortErrorMsg(RUNTIME_010, runtimeDescMap));
		this.registerPlugins(userOptions.plugins);
		const options = this.formatOptions(this.options, userOptions);
		this.options = options;
		return options;
	}
	async loadShare(pkgName, extraOptions) {
		return this.sharedHandler.loadShare(pkgName, extraOptions);
	}
	loadShareSync(pkgName, extraOptions) {
		return this.sharedHandler.loadShareSync(pkgName, extraOptions);
	}
	initializeSharing(shareScopeName = DEFAULT_SCOPE, extraOptions) {
		return this.sharedHandler.initializeSharing(shareScopeName, extraOptions);
	}
	initRawContainer(name, url, container) {
		const remoteInfo = getRemoteInfo({
			name,
			entry: url
		});
		const module = new Module$1({
			host: this,
			remoteInfo
		});
		module.remoteEntryExports = container;
		this.moduleCache.set(name, module);
		return module;
	}
	async loadRemote(id, options) {
		return this.remoteHandler.loadRemote(id, options);
	}
	async preloadRemote(preloadOptions) {
		return this.remoteHandler.preloadRemote(preloadOptions);
	}
	initShareScopeMap(scopeName, shareScope, extraOptions = {}) {
		this.sharedHandler.initShareScopeMap(scopeName, shareScope, extraOptions);
	}
	formatOptions(globalOptions, userOptions) {
		const { allShareInfos: shared } = formatShareConfigs(globalOptions, userOptions);
		const { userOptions: userOptionsRes, options: globalOptionsRes } = this.hooks.lifecycle.beforeInit.emit({
			origin: this,
			userOptions,
			options: globalOptions,
			shareInfo: shared
		});
		const remotes = this.remoteHandler.formatAndRegisterRemote(globalOptionsRes, userOptionsRes);
		const { allShareInfos } = this.sharedHandler.registerShared(globalOptionsRes, userOptionsRes);
		const plugins = [...globalOptionsRes.plugins];
		if (userOptionsRes.plugins) userOptionsRes.plugins.forEach((plugin) => {
			if (!plugins.includes(plugin)) plugins.push(plugin);
		});
		const optionsRes = {
			...globalOptions,
			...userOptions,
			plugins,
			remotes,
			shared: allShareInfos
		};
		this.hooks.lifecycle.init.emit({
			origin: this,
			options: optionsRes
		});
		return optionsRes;
	}
	registerPlugins(plugins) {
		const pluginRes = registerPlugins(plugins, this);
		this.options.plugins = this.options.plugins.reduce((res, plugin) => {
			if (!plugin) return res;
			if (res && !res.find((item) => item.name === plugin.name)) res.push(plugin);
			return res;
		}, pluginRes || []);
	}
	registerRemotes(remotes, options) {
		return this.remoteHandler.registerRemotes(remotes, options);
	}
	registerShared(shared) {
		this.sharedHandler.registerShared(this.options, {
			...this.options,
			shared
		});
	}
};

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/_virtual/_rolldown/runtime.js
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) {
		__defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	}
	if (!no_symbols) {
		__defProp(target, Symbol.toStringTag, { value: "Module" });
	}
	return target;
};

//#endregion

;// ../node_modules/@module-federation/runtime-core/dist/type/index.js


//#region src/type/index.ts
var type_exports = /* @__PURE__ */ __exportAll({});

//#endregion


;// ../node_modules/@module-federation/runtime-core/dist/index.js














//#region src/index.ts
const helpers = helpers_default;

//#endregion


;// ../node_modules/@module-federation/runtime/dist/utils.js


//#region src/utils.ts
function utils_getBuilderId() {
	return  true ? "admin:1.0.0" : 0;
}
function getGlobalFederationInstance(name, version) {
	const buildId = utils_getBuilderId();
	return CurrentGlobal.__FEDERATION__.__INSTANCES__.find((GMInstance) => {
		if (buildId && GMInstance.options.id === buildId) return true;
		if (GMInstance.options.name === name && !GMInstance.options.version && !version) return true;
		if (GMInstance.options.name === name && version && GMInstance.options.version === version) return true;
		return false;
	});
}

//#endregion


;// ../node_modules/@module-federation/runtime/dist/index.js




//#region src/index.ts
function createInstance(options) {
	const instance = new ((getGlobalFederationConstructor()) || ModuleFederation)(options);
	setGlobalFederationInstance(instance);
	return instance;
}
let FederationInstance = null;
/**
* @deprecated Use createInstance or getInstance instead
*/
function init(options) {
	const instance = getGlobalFederationInstance(options.name, options.version);
	if (!instance) {
		FederationInstance = createInstance(options);
		return FederationInstance;
	} else {
		instance.initOptions(options);
		if (!FederationInstance) FederationInstance = instance;
		return instance;
	}
}
function loadRemote(...args) {
	logger_assert(FederationInstance, RUNTIME_009, runtimeDescMap);
	return FederationInstance.loadRemote.apply(FederationInstance, args);
}
function loadShare(...args) {
	logger_assert(FederationInstance, RUNTIME_009, runtimeDescMap);
	return FederationInstance.loadShare.apply(FederationInstance, args);
}
function loadShareSync(...args) {
	logger_assert(FederationInstance, RUNTIME_009, runtimeDescMap);
	return FederationInstance.loadShareSync.apply(FederationInstance, args);
}
function preloadRemote(...args) {
	logger_assert(FederationInstance, RUNTIME_009, runtimeDescMap);
	return FederationInstance.preloadRemote.apply(FederationInstance, args);
}
function registerRemotes(...args) {
	logger_assert(FederationInstance, RUNTIME_009, runtimeDescMap);
	return FederationInstance.registerRemotes.apply(FederationInstance, args);
}
function dist_registerPlugins(...args) {
	logger_assert(FederationInstance, RUNTIME_009, runtimeDescMap);
	return FederationInstance.registerPlugins.apply(FederationInstance, args);
}
function getInstance() {
	return FederationInstance;
}
function registerShared(...args) {
	logger_assert(FederationInstance, RUNTIME_009, runtimeDescMap);
	return FederationInstance.registerShared.apply(FederationInstance, args);
}
setGlobalFederationConstructor(ModuleFederation);

//#endregion


;// ../node_modules/@module-federation/runtime/dist/bundler.js



;// ../node_modules/@module-federation/runtime/dist/helpers.js



//#region src/helpers.ts
const global = {
	...helpers.global,
	getGlobalFederationInstance: getGlobalFederationInstance
};
const share = helpers.share;
const utils = helpers.utils;
const runtimeHelpers = {
	global,
	share,
	utils
};

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/init.js



//#region src/init.ts
function init_init({ webpackRequire }) {
	const { initOptions, runtime, sharedFallback, bundlerRuntime, libraryType } = webpackRequire.federation;
	if (!initOptions) throw new Error("initOptions is required!");
	const treeShakingSharePlugin = function() {
		return {
			name: "tree-shake-plugin",
			beforeInit(args) {
				const { userOptions, origin, options: registeredOptions } = args;
				const version = userOptions.version || registeredOptions.version;
				if (!sharedFallback) return args;
				const currentShared = userOptions.shared || {};
				const shared = [];
				Object.keys(currentShared).forEach((sharedName) => {
					(Array.isArray(currentShared[sharedName]) ? currentShared[sharedName] : [currentShared[sharedName]]).forEach((sharedArg) => {
						shared.push([sharedName, sharedArg]);
						if ("get" in sharedArg) {
							sharedArg.treeShaking ||= {};
							sharedArg.treeShaking.get = sharedArg.get;
							sharedArg.get = bundlerRuntime.getSharedFallbackGetter({
								shareKey: sharedName,
								factory: sharedArg.get,
								webpackRequire,
								libraryType,
								version: sharedArg.version
							});
						}
					});
				});
				const hostGlobalSnapshot = runtimeHelpers.global.getGlobalSnapshotInfoByModuleInfo({
					name: origin.name,
					version
				});
				if (!hostGlobalSnapshot || !("shared" in hostGlobalSnapshot)) return args;
				Object.keys(registeredOptions.shared || {}).forEach((pkgName) => {
					registeredOptions.shared[pkgName].forEach((sharedArg) => {
						shared.push([pkgName, sharedArg]);
					});
				});
				const patchShared = (pkgName, shared) => {
					const shareSnapshot = hostGlobalSnapshot.shared.find((item) => item.sharedName === pkgName);
					if (!shareSnapshot) return;
					const { treeShaking } = shared;
					if (!treeShaking) return;
					const { secondarySharedTreeShakingName, secondarySharedTreeShakingEntry, treeShakingStatus } = shareSnapshot;
					if (treeShaking.status === treeShakingStatus) return;
					treeShaking.status = treeShakingStatus;
					if (secondarySharedTreeShakingEntry && libraryType && secondarySharedTreeShakingName) treeShaking.get = async () => {
						const shareEntry = await getRemoteEntry({
							origin,
							remoteInfo: {
								name: secondarySharedTreeShakingName,
								entry: secondarySharedTreeShakingEntry,
								type: libraryType,
								entryGlobalName: secondarySharedTreeShakingName,
								shareScope: "default"
							}
						});
						await shareEntry.init(origin, __webpack_require__.federation.bundlerRuntime);
						return shareEntry.get();
					};
				};
				shared.forEach(([pkgName, sharedArg]) => {
					patchShared(pkgName, sharedArg);
				});
				return args;
			}
		};
	};
	initOptions.plugins ||= [];
	initOptions.plugins.push(treeShakingSharePlugin());
	return runtime.init(initOptions);
}

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/getSharedFallbackGetter.js
//#region src/getSharedFallbackGetter.ts
const getSharedFallbackGetter = ({ shareKey, factory, version, webpackRequire, libraryType = "global" }) => {
	const { runtime, instance, bundlerRuntime, sharedFallback } = webpackRequire.federation;
	if (!sharedFallback) return factory;
	const fallbackItems = sharedFallback[shareKey];
	if (!fallbackItems) return factory;
	const fallbackItem = version ? fallbackItems.find((item) => item[1] === version) : fallbackItems[0];
	if (!fallbackItem) throw new Error(`No fallback item found for shareKey: ${shareKey} and version: ${version}`);
	return () => runtime.getRemoteEntry({
		origin: webpackRequire.federation.instance,
		remoteInfo: {
			name: fallbackItem[2],
			entry: `${webpackRequire.p}${fallbackItem[0]}`,
			type: libraryType,
			entryGlobalName: fallbackItem[2],
			shareScope: "default"
		}
	}).then((shareEntry) => {
		if (!shareEntry) throw new Error(`Failed to load fallback entry for shareKey: ${shareKey} and version: ${version}`);
		return shareEntry.init(webpackRequire.federation.instance, bundlerRuntime).then(() => shareEntry.get());
	});
};

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/index.js










//#region src/index.ts
const federation = {
	runtime: bundler_namespaceObject,
	instance: void 0,
	initOptions: void 0,
	bundlerRuntime: {
		remotes: remotes,
		consumes: consumes,
		I: initializeSharing,
		S: {},
		installInitialConsumes: installInitialConsumes,
		initContainerEntry: initContainerEntry,
		init: init_init,
		getSharedFallbackGetter: getSharedFallbackGetter
	},
	attachShareScopeMap: attachShareScopeMap,
	bundlerRuntimeOptions: {}
};
const instance = federation.instance;
const initOptions = federation.initOptions;
const bundlerRuntime = federation.bundlerRuntime;
const bundlerRuntimeOptions = federation.bundlerRuntimeOptions;

//#endregion


;// ../node_modules/@module-federation/webpack-bundler-runtime/dist/bundler.js




// EXTERNAL MODULE: ../node_modules/@module-federation/dts-plugin/dist/dynamic-remote-type-hints-plugin.js
var dynamic_remote_type_hints_plugin = __webpack_require__("../node_modules/@module-federation/dts-plugin/dist/dynamic-remote-type-hints-plugin.js");
var dynamic_remote_type_hints_plugin_default = /*#__PURE__*/__webpack_require__.n(dynamic_remote_type_hints_plugin);
;// ../node_modules/.federation/entry.95a9b3ff803c35eac759343ab00542c2.js



if(!__webpack_require__.federation.runtime || !__webpack_require__.federation.bundlerRuntime){
	var prevFederation = __webpack_require__.federation;
	__webpack_require__.federation = {}
	for(var key in federation){
		__webpack_require__.federation[key] = federation[key];
	}
	for(var key in prevFederation){
		__webpack_require__.federation[key] = prevFederation[key];
	}
}
if(!__webpack_require__.federation.instance){
	var pluginsToAdd = [
			(dynamic_remote_type_hints_plugin_default()) ? ((dynamic_remote_type_hints_plugin_default())["default"] || (dynamic_remote_type_hints_plugin_default()))(undefined) : false,
	].filter(Boolean);
	__webpack_require__.federation.initOptions.plugins = __webpack_require__.federation.initOptions.plugins ? 
	__webpack_require__.federation.initOptions.plugins.concat(pluginsToAdd) : pluginsToAdd;
	__webpack_require__.federation.instance = __webpack_require__.federation.bundlerRuntime.init({webpackRequire:__webpack_require__});
	if(__webpack_require__.federation.attachShareScopeMap){
		__webpack_require__.federation.attachShareScopeMap(__webpack_require__)
	}
	if(__webpack_require__.federation.installInitialConsumes){
		__webpack_require__.federation.installInitialConsumes()
	}

	if(!__webpack_require__.federation.isMFRemote && __webpack_require__.federation.prefetch){
	__webpack_require__.federation.prefetch()
	}
}

/***/ },

/***/ "../node_modules/@module-federation/dts-plugin/dist/Action-CzhPMw2i.js"
(__unused_webpack_module, exports) {

//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) {
		__defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	}
	if (!no_symbols) {
		__defProp(target, Symbol.toStringTag, { value: "Module" });
	}
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) {
				__defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
		}
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion

//#region src/server/message/Message.ts
var Message = class {
	constructor(type, kind) {
		this.type = type;
		this.kind = kind;
		this.time = Date.now();
	}
};

//#endregion
//#region src/server/constant.ts
const DEFAULT_WEB_SOCKET_PORT = 16322;
const WEB_SOCKET_CONNECT_MAGIC_ID = "1hpzW-zo2z-o8io-gfmV1-2cb1d82";
const MF_SERVER_IDENTIFIER = "Module Federation DTS";
const WEB_CLIENT_OPTIONS_IDENTIFIER = "__WEB_CLIENT_OPTIONS__";
const DEFAULT_TAR_NAME = "@mf-types.zip";
let UpdateMode = /* @__PURE__ */ function(UpdateMode) {
	UpdateMode["POSITIVE"] = "POSITIVE";
	UpdateMode["PASSIVE"] = "PASSIVE";
	return UpdateMode;
}({});

//#endregion
//#region src/server/message/Action/Action.ts
let ActionKind = /* @__PURE__ */ function(ActionKind) {
	ActionKind["ADD_SUBSCRIBER"] = "ADD_SUBSCRIBER";
	ActionKind["EXIT_SUBSCRIBER"] = "EXIT_SUBSCRIBER";
	ActionKind["ADD_PUBLISHER"] = "ADD_PUBLISHER";
	ActionKind["UPDATE_PUBLISHER"] = "UPDATE_PUBLISHER";
	ActionKind["NOTIFY_SUBSCRIBER"] = "NOTIFY_SUBSCRIBER";
	ActionKind["EXIT_PUBLISHER"] = "EXIT_PUBLISHER";
	ActionKind["ADD_WEB_CLIENT"] = "ADD_WEB_CLIENT";
	ActionKind["NOTIFY_WEB_CLIENT"] = "NOTIFY_WEB_CLIENT";
	ActionKind["FETCH_TYPES"] = "FETCH_TYPES";
	ActionKind["ADD_DYNAMIC_REMOTE"] = "ADD_DYNAMIC_REMOTE";
	return ActionKind;
}({});
var Action = class extends Message {
	constructor(content, kind) {
		super("Action", kind);
		const { payload } = content;
		this.payload = payload;
	}
};

//#endregion
Object.defineProperty(exports, "Action", ({
  enumerable: true,
  get: function () {
    return Action;
  }
}));
Object.defineProperty(exports, "ActionKind", ({
  enumerable: true,
  get: function () {
    return ActionKind;
  }
}));
Object.defineProperty(exports, "DEFAULT_TAR_NAME", ({
  enumerable: true,
  get: function () {
    return DEFAULT_TAR_NAME;
  }
}));
Object.defineProperty(exports, "DEFAULT_WEB_SOCKET_PORT", ({
  enumerable: true,
  get: function () {
    return DEFAULT_WEB_SOCKET_PORT;
  }
}));
Object.defineProperty(exports, "MF_SERVER_IDENTIFIER", ({
  enumerable: true,
  get: function () {
    return MF_SERVER_IDENTIFIER;
  }
}));
Object.defineProperty(exports, "Message", ({
  enumerable: true,
  get: function () {
    return Message;
  }
}));
Object.defineProperty(exports, "UpdateMode", ({
  enumerable: true,
  get: function () {
    return UpdateMode;
  }
}));
Object.defineProperty(exports, "WEB_CLIENT_OPTIONS_IDENTIFIER", ({
  enumerable: true,
  get: function () {
    return WEB_CLIENT_OPTIONS_IDENTIFIER;
  }
}));
Object.defineProperty(exports, "WEB_SOCKET_CONNECT_MAGIC_ID", ({
  enumerable: true,
  get: function () {
    return WEB_SOCKET_CONNECT_MAGIC_ID;
  }
}));
Object.defineProperty(exports, "__exportAll", ({
  enumerable: true,
  get: function () {
    return __exportAll;
  }
}));
Object.defineProperty(exports, "__toESM", ({
  enumerable: true,
  get: function () {
    return __toESM;
  }
}));

/***/ },

/***/ "../node_modules/@module-federation/dts-plugin/dist/dynamic-remote-type-hints-plugin.js"
(module, __unused_webpack_exports, __webpack_require__) {

const require_Action = __webpack_require__("../node_modules/@module-federation/dts-plugin/dist/Action-CzhPMw2i.js");
const require_utils = __webpack_require__("../node_modules/@module-federation/dts-plugin/dist/utils-7KqCZHbb.js");
let isomorphic_ws = __webpack_require__("../node_modules/isomorphic-ws/node.js");
isomorphic_ws = require_Action.__toESM(isomorphic_ws);

//#region src/server/message/Action/FetchTypes.ts
var FetchTypesAction = class extends require_Action.Action {
	constructor(payload) {
		super({ payload }, require_Action.ActionKind.FETCH_TYPES);
	}
};

//#endregion
//#region src/server/message/Action/AddDynamicRemote.ts
var AddDynamicRemoteAction = class extends require_Action.Action {
	constructor(payload) {
		super({ payload }, require_Action.ActionKind.ADD_DYNAMIC_REMOTE);
	}
};

//#endregion
//#region src/server/createWebsocket.ts
function createWebsocket() {
	return new isomorphic_ws.default(`ws://127.0.0.1:${require_Action.DEFAULT_WEB_SOCKET_PORT}?WEB_SOCKET_CONNECT_MAGIC_ID=${require_Action.WEB_SOCKET_CONNECT_MAGIC_ID}`);
}

//#endregion
//#region src/runtime-plugins/dynamic-remote-type-hints-plugin.ts
const PLUGIN_NAME = "dynamic-remote-type-hints-plugin";
function dynamicRemoteTypeHintsPlugin() {
	let ws = createWebsocket();
	let isConnected = false;
	ws.onopen = () => {
		isConnected = true;
	};
	ws.onerror = (err) => {
		console.error(`[ ${PLUGIN_NAME} ] err: ${err}`);
	};
	return {
		name: "dynamic-remote-type-hints-plugin",
		registerRemote(args) {
			const { remote, origin } = args;
			try {
				if (!isConnected) return args;
				if (!("entry" in remote)) return args;
				const defaultIpV4 =  true ? "26.73.139.35" : 0;
				const remoteIp = require_utils.getIpFromEntry(remote.entry, defaultIpV4);
				const remoteInfo = {
					name: remote.name,
					url: remote.entry,
					alias: remote.alias || remote.name
				};
				if (remoteIp) ws.send(JSON.stringify(new AddDynamicRemoteAction({
					remoteIp,
					remoteInfo,
					name: origin.name,
					ip: defaultIpV4
				})));
				ws.send(JSON.stringify(new FetchTypesAction({
					name: origin.name,
					ip: defaultIpV4,
					remoteInfo
				})));
				return args;
			} catch (err) {
				console.error(new Error(err));
				return args;
			}
		}
	};
}

//#endregion
module.exports = dynamicRemoteTypeHintsPlugin;

/***/ },

/***/ "../node_modules/@module-federation/dts-plugin/dist/utils-7KqCZHbb.js"
(__unused_webpack_module, exports) {


//#region src/dev-worker/utils.ts
const DEFAULT_LOCAL_IPS = ["localhost", "127.0.0.1"];
function getIpFromEntry(entry, ipv4) {
	let ip;
	entry.replace(/https?:\/\/([0-9|.]+|localhost):/, (str, matched) => {
		ip = matched;
		return str;
	});
	if (ip) return DEFAULT_LOCAL_IPS.includes(ip) ? ipv4 : ip;
}

//#endregion
Object.defineProperty(exports, "getIpFromEntry", ({
  enumerable: true,
  get: function () {
    return getIpFromEntry;
  }
}));

/***/ },

/***/ "../node_modules/ansi-html-community/index.js"
(module) {



module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ },

/***/ "../node_modules/events/events.js"
(module) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ },

/***/ "../node_modules/isomorphic-ws/node.js"
(module, __unused_webpack_exports, __webpack_require__) {



module.exports = __webpack_require__("../node_modules/ws/browser.js");

/***/ },

/***/ "../node_modules/webpack-dev-server/client/clients/WebSocketClient.js"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WebSocketClient)
/* harmony export */ });
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/webpack-dev-server/client/utils/log.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/** @typedef {import("../index").EXPECTED_ANY} EXPECTED_ANY */

/**
 * @implements {CommunicationClient}
 */
var WebSocketClient = /*#__PURE__*/function () {
  /**
   * @param {string} url url to connect
   */
  function WebSocketClient(url) {
    _classCallCheck(this, WebSocketClient);
    this.client = new WebSocket(url);
    this.client.onerror = function (error) {
      _utils_log_js__WEBPACK_IMPORTED_MODULE_0__.log.error(error);
    };
  }

  /**
   * @param {(...args: EXPECTED_ANY[]) => void} fn function
   */
  return _createClass(WebSocketClient, [{
    key: "onOpen",
    value: function onOpen(fn) {
      this.client.onopen = fn;
    }

    /**
     * @param {(...args: EXPECTED_ANY[]) => void} fn function
     */
  }, {
    key: "onClose",
    value: function onClose(fn) {
      this.client.onclose = fn;
    }

    // call f with the message string as the first argument
    /**
     * @param {(...args: EXPECTED_ANY[]) => void} fn function
     */
  }, {
    key: "onMessage",
    value: function onMessage(fn) {
      this.client.onmessage = function (err) {
        fn(err.data);
      };
    }
  }]);
}();


/***/ },

/***/ "../node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=localhost&port=4101&pathname=%2Fws&logging=info&overlay=%7B%22errors%22%3Atrue%2C%22warnings%22%3Afalse%7D&reconnect=10&hot=false&live-reload=true"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  createSocketURL: () => (/* binding */ createSocketURL),
  getCurrentScriptSource: () => (/* binding */ getCurrentScriptSource),
  parseURL: () => (/* binding */ parseURL)
});
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ../node_modules/webpack/hot/emitter.js
var emitter = __webpack_require__("../node_modules/webpack/hot/emitter.js");
var emitter_default = /*#__PURE__*/__webpack_require__.n(emitter);
// EXTERNAL MODULE: ../node_modules/webpack/hot/log.js
var log = __webpack_require__("../node_modules/webpack/hot/log.js");
var log_default = /*#__PURE__*/__webpack_require__.n(log);
// EXTERNAL MODULE: ../node_modules/ansi-html-community/index.js
var ansi_html_community = __webpack_require__("../node_modules/ansi-html-community/index.js");
var ansi_html_community_default = /*#__PURE__*/__webpack_require__.n(ansi_html_community);
;// ../node_modules/webpack-dev-server/client/overlay.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// The error overlay is inspired (and mostly copied) from Create React App (https://github.com/facebookincubator/create-react-app)
// They, in turn, got inspired by webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware).



/** @typedef {import("./index").EXPECTED_ANY} EXPECTED_ANY */

/**
 * @type {(input: string, position: number) => number | undefined}
 */
// @ts-expect-error
var getCodePoint = String.prototype.codePointAt ?
// @ts-expect-error
function (input, position) {
  return input.codePointAt(position);
} : function (input, position) {
  return (input.charCodeAt(position) - 0xd800) * 0x400 + input.charCodeAt(position + 1) - 0xdc00 + 0x10000;
};

/**
 * @param {string} macroText macro text
 * @param {RegExp} macroRegExp macro reg exp
 * @param {(input: string) => string} macroReplacer macro replacer
 * @returns {string} result
 */
var replaceUsingRegExp = function replaceUsingRegExp(macroText, macroRegExp, macroReplacer) {
  macroRegExp.lastIndex = 0;
  var replaceMatch = macroRegExp.exec(macroText);
  var replaceResult;
  if (replaceMatch) {
    replaceResult = "";
    var replaceLastIndex = 0;
    do {
      if (replaceLastIndex !== replaceMatch.index) {
        replaceResult += macroText.slice(replaceLastIndex, replaceMatch.index);
      }
      var replaceInput = replaceMatch[0];
      replaceResult += macroReplacer(replaceInput);
      replaceLastIndex = replaceMatch.index + replaceInput.length;
    } while (replaceMatch = macroRegExp.exec(macroText));
    if (replaceLastIndex !== macroText.length) {
      replaceResult += macroText.slice(replaceLastIndex);
    }
  } else {
    replaceResult = macroText;
  }
  return replaceResult;
};
var references = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
  "&": "&amp;"
};

/**
 * @param {string} text text
 * @returns {string} encoded text
 */
function encode(text) {
  if (!text) {
    return "";
  }
  return replaceUsingRegExp(text, /[<>'"&]/g, function (input) {
    var result = references[(/** @type {keyof typeof references} */input)];
    if (!result) {
      var code = input.length > 1 ? getCodePoint(input, 0) : input.charCodeAt(0);
      result = "&#".concat(code, ";");
    }
    return result;
  });
}

/**
 * @typedef {object} Context
 * @property {'warning' | 'error'} level level
 * @property {(string  | Message)[]} messages messages
 * @property {'build' | 'runtime'} messageSource message source
 */

/** @typedef {{ type: string } & Record<string, EXPECTED_ANY>} Event */

/**
 * @typedef {object} Options
 * @property {{ [state: string]: { on: Record<string, { target: string; actions?: Array<string> }> } }} states states
 * @property {Context} context context
 * @property {string} initial initial
 */

/**
 * @typedef {object} Implementation
 * @property {{ [actionName: string]: (ctx: Context, event: Event) => Context | void }} actions actions
 */

/**
 * @typedef {{ send: (event: Event) => void }} StateMachine
 */

/**
 * A simplified `createMachine` from `@xstate/fsm` with the following differences:
 * - the returned machine is technically a "service". No `interpret(machine).start()` is needed.
 * - the state definition only support `on` and target must be declared with { target: 'nextState', actions: [] } explicitly.
 * - event passed to `send` must be an object with `type` property.
 * - actions implementation will be [assign action](https://xstate.js.org/docs/guides/context.html#assign-action) if you return any value.
 * Do not return anything if you just want to invoke side effect.
 *
 * The goal of this custom function is to avoid installing the entire `'xstate/fsm'` package, while enabling modeling using
 * state machine. You can copy the first parameter into the editor at https://stately.ai/viz to visualize the state machine.
 * @param {Options} options options
 * @param {Implementation} implementation implementation
 * @returns {StateMachine} state machine
 */
function createMachine(_ref, _ref2) {
  var states = _ref.states,
    context = _ref.context,
    initial = _ref.initial;
  var actions = _ref2.actions;
  var currentState = initial;
  var currentContext = context;
  return {
    send: function send(event) {
      var currentStateOn = states[currentState].on;
      var transitionConfig = currentStateOn && currentStateOn[event.type];
      if (transitionConfig) {
        currentState = transitionConfig.target;
        if (transitionConfig.actions) {
          transitionConfig.actions.forEach(function (actName) {
            var actionImpl = actions[actName];
            var nextContextValue = actionImpl && actionImpl(currentContext, event);
            if (nextContextValue) {
              currentContext = _objectSpread(_objectSpread({}, currentContext), nextContextValue);
            }
          });
        }
      }
    }
  };
}

/**
 * @typedef {object} ShowOverlayData
 * @property {'warning' | 'error'} level level
 * @property {(string  | Message)[]} messages messages
 * @property {'build' | 'runtime'} messageSource message source
 */

/**
 * @typedef {object} CreateOverlayMachineOptions
 * @property {(data: ShowOverlayData) => void} showOverlay show overlay
 * @property {() => void} hideOverlay hide overlay
 */

/**
 * @param {CreateOverlayMachineOptions} options options
 * @returns {StateMachine} state machine
 */
var createOverlayMachine = function createOverlayMachine(options) {
  var hideOverlay = options.hideOverlay,
    showOverlay = options.showOverlay;
  return createMachine({
    initial: "hidden",
    context: {
      level: "error",
      messages: [],
      messageSource: "build"
    },
    states: {
      hidden: {
        on: {
          BUILD_ERROR: {
            target: "displayBuildError",
            actions: ["setMessages", "showOverlay"]
          },
          RUNTIME_ERROR: {
            target: "displayRuntimeError",
            actions: ["setMessages", "showOverlay"]
          }
        }
      },
      displayBuildError: {
        on: {
          DISMISS: {
            target: "hidden",
            actions: ["dismissMessages", "hideOverlay"]
          },
          BUILD_ERROR: {
            target: "displayBuildError",
            actions: ["appendMessages", "showOverlay"]
          }
        }
      },
      displayRuntimeError: {
        on: {
          DISMISS: {
            target: "hidden",
            actions: ["dismissMessages", "hideOverlay"]
          },
          RUNTIME_ERROR: {
            target: "displayRuntimeError",
            actions: ["appendMessages", "showOverlay"]
          },
          BUILD_ERROR: {
            target: "displayBuildError",
            actions: ["setMessages", "showOverlay"]
          }
        }
      }
    }
  }, {
    actions: {
      dismissMessages: function dismissMessages() {
        return {
          messages: [],
          level: "error",
          messageSource: "build"
        };
      },
      appendMessages: function appendMessages(context, event) {
        return {
          messages: context.messages.concat(event.messages),
          level: event.level || context.level,
          messageSource: event.type === "RUNTIME_ERROR" ? "runtime" : "build"
        };
      },
      setMessages: function setMessages(context, event) {
        return {
          messages: event.messages,
          level: event.level || context.level,
          messageSource: event.type === "RUNTIME_ERROR" ? "runtime" : "build"
        };
      },
      hideOverlay: hideOverlay,
      showOverlay: showOverlay
    }
  });
};

/**
 * @param {Error} error error
 * @returns {undefined | string[]} stack
 */
var parseErrorToStacks = function parseErrorToStacks(error) {
  if (!error || !(error instanceof Error)) {
    throw new Error("parseErrorToStacks expects Error object");
  }
  if (typeof error.stack === "string") {
    return error.stack.split("\n").filter(function (stack) {
      return stack !== "Error: ".concat(error.message);
    });
  }
};

/**
 * @callback ErrorCallback
 * @param {ErrorEvent} error
 * @returns {void}
 */

/**
 * @param {ErrorCallback} callback callback
 * @returns {() => void} cleanup
 */
var listenToRuntimeError = function listenToRuntimeError(callback) {
  window.addEventListener("error", callback);
  return function cleanup() {
    window.removeEventListener("error", callback);
  };
};

/**
 * @callback UnhandledRejectionCallback
 * @param {PromiseRejectionEvent} rejectionEvent
 * @returns {void}
 */

/**
 * @param {UnhandledRejectionCallback} callback callback
 * @returns {() => void} cleanup
 */
var listenToUnhandledRejection = function listenToUnhandledRejection(callback) {
  window.addEventListener("unhandledrejection", callback);
  return function cleanup() {
    window.removeEventListener("unhandledrejection", callback);
  };
};

// Styles are inspired by `react-error-overlay`

var msgStyles = {
  error: {
    backgroundColor: "rgba(206, 17, 38, 0.1)",
    color: "#fccfcf"
  },
  warning: {
    backgroundColor: "rgba(251, 245, 180, 0.1)",
    color: "#fbf5b4"
  }
};
var iframeStyle = {
  position: "fixed",
  top: "0px",
  left: "0px",
  right: "0px",
  bottom: "0px",
  width: "100vw",
  height: "100vh",
  border: "none",
  "z-index": 9999999999
};
var containerStyle = {
  position: "fixed",
  boxSizing: "border-box",
  left: "0px",
  top: "0px",
  right: "0px",
  bottom: "0px",
  width: "100vw",
  height: "100vh",
  fontSize: "large",
  padding: "2rem 2rem 4rem 2rem",
  lineHeight: "1.2",
  whiteSpace: "pre-wrap",
  overflow: "auto",
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "white"
};
var headerStyle = {
  color: "#e83b46",
  fontSize: "2em",
  whiteSpace: "pre-wrap",
  fontFamily: "sans-serif",
  margin: "0 2rem 2rem 0",
  flex: "0 0 auto",
  maxHeight: "50%",
  overflow: "auto"
};
var dismissButtonStyle = {
  color: "#ffffff",
  lineHeight: "1rem",
  fontSize: "1.5rem",
  padding: "1rem",
  cursor: "pointer",
  position: "absolute",
  right: "0px",
  top: "0px",
  backgroundColor: "transparent",
  border: "none"
};
var msgTypeStyle = {
  color: "#e83b46",
  fontSize: "1.2em",
  marginBottom: "1rem",
  fontFamily: "sans-serif"
};
var msgTextStyle = {
  lineHeight: "1.5",
  fontSize: "1rem",
  fontFamily: "Menlo, Consolas, monospace"
};

// ANSI HTML

var colors = {
  reset: ["transparent", "transparent"],
  black: "181818",
  red: "E36049",
  green: "B3CB74",
  yellow: "FFD080",
  blue: "7CAFC2",
  magenta: "7FACCA",
  cyan: "C3C2EF",
  lightgrey: "EBE7E3",
  darkgrey: "6D7891"
};
ansi_html_community_default().setColors(colors);

/** @typedef {Error & { file?: string, moduleName?: string, moduleIdentifier?: string, loc?: string, message?: string; stack?: string | string[] }} Message */

/**
 * @param {string} type type
 * @param {string | Message} item item
 * @returns {{ header: string, body: string }} formatted problem
 */
var formatProblem = function formatProblem(type, item) {
  var header = type === "warning" ? "WARNING" : "ERROR";
  var body = "";
  if (typeof item === "string") {
    body += item;
  } else {
    var file = item.file || "";
    var moduleName = item.moduleName ? item.moduleName.indexOf("!") !== -1 ? "".concat(item.moduleName.replace(/^(\s|\S)*!/, ""), " (").concat(item.moduleName, ")") : "".concat(item.moduleName) : "";
    var loc = item.loc;
    header += "".concat(moduleName || file ? " in ".concat(moduleName ? "".concat(moduleName).concat(file ? " (".concat(file, ")") : "") : file).concat(loc ? " ".concat(loc) : "") : "");
    body += item.message || "";
  }
  if (typeof item !== "string" && Array.isArray(item.stack)) {
    item.stack.forEach(function (stack) {
      if (typeof stack === "string") {
        body += "\r\n".concat(stack);
      }
    });
  }
  return {
    header: header,
    body: body
  };
};

/**
 * @typedef {object} CreateOverlayOptions
 * @property {(false | string)=} trustedTypesPolicyName trusted types policy name
 * @property {(boolean | ((error: Error) => void))=} catchRuntimeError runtime error catcher
 */

/**
 * @param {CreateOverlayOptions} options options
 * @returns {StateMachine} overlay
 */
var createOverlay = function createOverlay(options) {
  /** @type {HTMLIFrameElement | null | undefined} */
  var iframeContainerElement;
  /** @type {HTMLDivElement | null | undefined} */
  var containerElement;
  /** @type {HTMLDivElement | null | undefined} */
  var headerElement;
  /** @type {Array<(element: HTMLDivElement) => void>} */
  var onLoadQueue = [];
  /** @type {Omit<TrustedTypePolicy, "createScript" | "createScriptURL"> | undefined} */
  var overlayTrustedTypesPolicy;

  /** @typedef {Extract<keyof CSSStyleDeclaration, "string">} CSSStyleDeclarationKeys */

  /**
   * @param {HTMLElement} element element
   * @param {Partial<CSSStyleDeclaration>} style style
   */
  function applyStyle(element, style) {
    Object.keys(style).forEach(function (prop) {
      element.style[(/** @type {CSSStyleDeclarationKeys} */prop)] = /** @type {string} */
      style[(/** @type {CSSStyleDeclarationKeys} */prop)];
    });
  }

  /**
   * @param {string | false | undefined} trustedTypesPolicyName trusted types police name
   */
  function createContainer(trustedTypesPolicyName) {
    // Enable Trusted Types if they are available in the current browser.
    if (window.trustedTypes) {
      overlayTrustedTypesPolicy = window.trustedTypes.createPolicy(trustedTypesPolicyName || "webpack-dev-server#overlay", {
        createHTML: function createHTML(value) {
          return value;
        }
      });
    }
    iframeContainerElement = document.createElement("iframe");
    iframeContainerElement.id = "webpack-dev-server-client-overlay";
    iframeContainerElement.src = "about:blank";
    applyStyle(iframeContainerElement, iframeStyle);
    iframeContainerElement.onload = function () {
      var contentElement = /** @type {Document} */
      (/** @type {HTMLIFrameElement} */
      iframeContainerElement.contentDocument).createElement("div");
      containerElement = /** @type {Document} */
      (/** @type {HTMLIFrameElement} */
      iframeContainerElement.contentDocument).createElement("div");
      contentElement.id = "webpack-dev-server-client-overlay-div";
      applyStyle(contentElement, containerStyle);
      headerElement = document.createElement("div");
      headerElement.innerText = "Compiled with problems:";
      applyStyle(headerElement, headerStyle);
      var closeButtonElement = document.createElement("button");
      applyStyle(closeButtonElement, dismissButtonStyle);
      closeButtonElement.innerText = "×";
      closeButtonElement.ariaLabel = "Dismiss";
      closeButtonElement.addEventListener("click", function () {
        // eslint-disable-next-line no-use-before-define
        overlayService.send({
          type: "DISMISS"
        });
      });
      contentElement.appendChild(headerElement);
      contentElement.appendChild(closeButtonElement);
      contentElement.appendChild(containerElement);

      /** @type {Document} */
      (/** @type {HTMLIFrameElement} */
      iframeContainerElement.contentDocument).body.appendChild(contentElement);
      onLoadQueue.forEach(function (onLoad) {
        onLoad(/** @type {HTMLDivElement} */contentElement);
      });
      onLoadQueue = [];

      /** @type {HTMLIFrameElement} */
      iframeContainerElement.onload = null;
    };
    document.body.appendChild(iframeContainerElement);
  }

  /**
   * @param {(element: HTMLDivElement) => void} callback callback
   * @param {string | false | undefined} trustedTypesPolicyName trusted types policy name
   */
  function ensureOverlayExists(callback, trustedTypesPolicyName) {
    if (containerElement) {
      // @ts-expect-error https://github.com/microsoft/TypeScript/issues/30024
      containerElement.innerHTML = overlayTrustedTypesPolicy ? overlayTrustedTypesPolicy.createHTML("") : "";
      // Everything is ready, call the callback right away.
      callback(containerElement);
      return;
    }
    onLoadQueue.push(callback);
    if (iframeContainerElement) {
      return;
    }
    createContainer(trustedTypesPolicyName);
  }

  // Successful compilation.
  /**
   * @returns {void}
   */
  function hide() {
    if (!iframeContainerElement) {
      return;
    }

    // Clean up and reset internal state.
    document.body.removeChild(iframeContainerElement);
    iframeContainerElement = null;
    containerElement = null;
  }

  // Compilation with errors (e.g. syntax error or missing modules).
  /**
   * @param {string} type type
   * @param {(string | Message)[]} messages messages
   * @param {undefined | false | string} trustedTypesPolicyName trusted types policy name
   * @param {'build' | 'runtime'} messageSource message source
   */
  function show(type, messages, trustedTypesPolicyName, messageSource) {
    ensureOverlayExists(function () {
      /** @type {HTMLDivElement} */
      headerElement.innerText = messageSource === "runtime" ? "Uncaught runtime errors:" : "Compiled with problems:";
      messages.forEach(function (message) {
        var entryElement = document.createElement("div");
        var msgStyle = type === "warning" ? msgStyles.warning : msgStyles.error;
        applyStyle(entryElement, _objectSpread(_objectSpread({}, msgStyle), {}, {
          padding: "1rem 1rem 1.5rem 1rem"
        }));
        var typeElement = document.createElement("div");
        var _formatProblem = formatProblem(type, message),
          header = _formatProblem.header,
          body = _formatProblem.body;
        typeElement.innerText = header;
        applyStyle(typeElement, msgTypeStyle);
        if (typeof message !== "string" && message.moduleIdentifier) {
          applyStyle(typeElement, {
            cursor: "pointer"
          });
          // element.dataset not supported in IE
          typeElement.setAttribute("data-can-open", "true");
          typeElement.addEventListener("click", function () {
            fetch("/webpack-dev-server/open-editor?fileName=".concat(message.moduleIdentifier));
          });
        }

        // Make it look similar to our terminal.
        var text = ansi_html_community_default()(encode(body));
        var messageTextNode = document.createElement("div");
        applyStyle(messageTextNode, msgTextStyle);

        // @ts-expect-error https://github.com/microsoft/TypeScript/issues/30024
        messageTextNode.innerHTML = overlayTrustedTypesPolicy ? overlayTrustedTypesPolicy.createHTML(text) : text;
        entryElement.appendChild(typeElement);
        entryElement.appendChild(messageTextNode);

        /** @type {HTMLDivElement} */
        containerElement.appendChild(entryElement);
      });
    }, trustedTypesPolicyName);
  }

  /** @type {(event: KeyboardEvent) => void} */
  var handleEscapeKey;

  /**
   * @returns {void}
   */

  var hideOverlayWithEscCleanup = function hideOverlayWithEscCleanup() {
    window.removeEventListener("keydown", handleEscapeKey);
    hide();
  };
  var overlayService = createOverlayMachine({
    showOverlay: function showOverlay(_ref3) {
      var _ref3$level = _ref3.level,
        level = _ref3$level === void 0 ? "error" : _ref3$level,
        messages = _ref3.messages,
        messageSource = _ref3.messageSource;
      return show(level, messages, options.trustedTypesPolicyName, messageSource);
    },
    hideOverlay: hideOverlayWithEscCleanup
  });
  /**
   * ESC key press to dismiss the overlay.
   * @param {KeyboardEvent} event Keydown event
   */
  handleEscapeKey = function handleEscapeKey(event) {
    if (event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) {
      overlayService.send({
        type: "DISMISS"
      });
    }
  };
  window.addEventListener("keydown", handleEscapeKey);
  if (options.catchRuntimeError) {
    /**
     * @param {Error | undefined} error error
     * @param {string} fallbackMessage fallback message
     */
    var handleError = function handleError(error, fallbackMessage) {
      var errorObject = error instanceof Error ? error : new Error(error || fallbackMessage, {
        cause: error
      });
      var shouldDisplay = typeof options.catchRuntimeError === "function" ? options.catchRuntimeError(errorObject) : true;
      if (shouldDisplay) {
        overlayService.send({
          type: "RUNTIME_ERROR",
          messages: [{
            message: errorObject.message,
            stack: parseErrorToStacks(errorObject)
          }]
        });
      }
    };
    listenToRuntimeError(function (errorEvent) {
      // error property may be empty in older browser like IE
      var error = errorEvent.error,
        message = errorEvent.message;
      if (!error && !message) {
        return;
      }

      // if error stack indicates a React error boundary caught the error, do not show overlay.
      if (error && error.stack && error.stack.includes("invokeGuardedCallbackDev")) {
        return;
      }
      handleError(error, message);
    });
    listenToUnhandledRejection(function (promiseRejectionEvent) {
      var reason = promiseRejectionEvent.reason;
      handleError(reason, "Unknown promise rejection reason");
    });
  }
  return overlayService;
};

;// ../node_modules/webpack-dev-server/client/progress.js
function progress_typeof(o) { "@babel/helpers - typeof"; return progress_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, progress_typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, progress_toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function progress_toPropertyKey(t) { var i = progress_toPrimitive(t, "string"); return "symbol" == progress_typeof(i) ? i : i + ""; }
function progress_toPrimitive(t, r) { if ("object" != progress_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != progress_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == progress_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
/**
 * @returns {boolean} true when custom elements supported, otherwise false
 */
function isProgressSupported() {
  return "customElements" in self && Boolean(HTMLElement.prototype.attachShadow);
}

/**
 * @returns {void}
 */
function defineProgressElement() {
  var _WebpackDevServerProgress;
  if (customElements.get("wds-progress")) {
    return;
  }
  var _WebpackDevServerProgress_brand = /*#__PURE__*/new WeakSet();
  var WebpackDevServerProgress = /*#__PURE__*/function (_HTMLElement) {
    function WebpackDevServerProgress() {
      var _this;
      _classCallCheck(this, WebpackDevServerProgress);
      _this = _callSuper(this, WebpackDevServerProgress);
      _classPrivateMethodInitSpec(_this, _WebpackDevServerProgress_brand);
      _this.attachShadow({
        mode: "open"
      });
      _this.maxDashOffset = -219.99078369140625;
      _this.animationTimer = null;
      return _this;
    }
    _inherits(WebpackDevServerProgress, _HTMLElement);
    return _createClass(WebpackDevServerProgress, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        _assertClassBrand(_WebpackDevServerProgress_brand, this, _reset).call(this);
      }
    }, {
      key: "attributeChangedCallback",
      value:
      /**
       * @param {string} name name
       * @param {string} oldValue old value
       * @param {string} newValue new value
       */
      function attributeChangedCallback(name, oldValue, newValue) {
        if (name === "progress") {
          _assertClassBrand(_WebpackDevServerProgress_brand, this, _update).call(this, Number(newValue));
        } else if (name === "type") {
          _assertClassBrand(_WebpackDevServerProgress_brand, this, _reset).call(this);
        }
      }

      /**
       * @param {number} percent percent
       */
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ["progress", "type"];
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
  _WebpackDevServerProgress = WebpackDevServerProgress;
  function _reset() {
    var _this$getAttribute;
    clearTimeout(this.animationTimer);
    this.animationTimer = null;
    var typeAttr = (_this$getAttribute = this.getAttribute("type")) === null || _this$getAttribute === void 0 ? void 0 : _this$getAttribute.toLowerCase();
    this.type = typeAttr === "circular" ? "circular" : "linear";
    var innerHTML = this.type === "circular" ? _circularTemplate.call(_WebpackDevServerProgress) : _linearTemplate.call(_WebpackDevServerProgress);
    /** @type {ShadowRoot} */
    this.shadowRoot.innerHTML = innerHTML;
    var progressValue = this.getAttribute("progress");
    this.initialProgress = progressValue ? Number(progressValue) : 0;
    _assertClassBrand(_WebpackDevServerProgress_brand, this, _update).call(this, this.initialProgress);
  }
  function _circularTemplate() {
    return "\n        <style>\n        :host {\n            width: 200px;\n            height: 200px;\n            position: fixed;\n            right: 5%;\n            top: 5%;\n            pointer-events: none;\n            transition: opacity .25s ease-in-out;\n            z-index: 2147483645;\n        }\n\n        circle {\n            fill: #282d35;\n        }\n\n        path {\n            fill: rgba(0, 0, 0, 0);\n            stroke: rgb(186, 223, 172);\n            stroke-dasharray: 219.99078369140625;\n            stroke-dashoffset: -219.99078369140625;\n            stroke-width: 10;\n            transform: rotate(90deg) translate(0px, -80px);\n        }\n\n        text {\n            font-family: 'Open Sans', sans-serif;\n            font-size: 18px;\n            fill: #ffffff;\n            dominant-baseline: middle;\n            text-anchor: middle;\n        }\n\n        tspan#percent-super {\n            fill: #bdc3c7;\n            font-size: 0.45em;\n            baseline-shift: 10%;\n        }\n\n        @keyframes fade {\n            0% { opacity: 1; transform: scale(1); }\n            100% { opacity: 0; transform: scale(0); }\n        }\n\n        .disappear {\n            animation: fade 0.3s;\n            animation-fill-mode: forwards;\n            animation-delay: 0.5s;\n        }\n\n        .hidden {\n            display: none;\n        }\n        </style>\n        <svg id=\"progress\" class=\"hidden noselect\" viewBox=\"0 0 80 80\">\n        <circle cx=\"50%\" cy=\"50%\" r=\"35\"></circle>\n        <path d=\"M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0\"></path>\n        <text x=\"50%\" y=\"51%\">\n            <tspan id=\"percent-value\">0</tspan>\n            <tspan id=\"percent-super\">%</tspan>\n        </text>\n        </svg>\n      ";
  }
  function _linearTemplate() {
    return "\n        <style>\n        :host {\n            position: fixed;\n            top: 0;\n            left: 0;\n            pointer-events: none;\n            height: 4px;\n            width: 100vw;\n            z-index: 2147483645;\n        }\n\n        #bar {\n            width: 0%;\n            height: 4px;\n            background-color: rgb(186, 223, 172);\n        }\n\n        @keyframes fade {\n            0% { opacity: 1; }\n            100% { opacity: 0; }\n        }\n\n        .disappear {\n            animation: fade 0.3s;\n            animation-fill-mode: forwards;\n            animation-delay: 0.5s;\n        }\n\n        .hidden {\n            display: none;\n        }\n        </style>\n        <div id=\"progress\"></div>\n        ";
  }
  function _update(percent) {
    var shadowRoot = /** @type {ShadowRoot} */this.shadowRoot;
    var element = /** @type {HTMLElement} */
    shadowRoot.querySelector("#progress");
    if (this.type === "circular") {
      var path = /** @type {SVGPathElement} */
      shadowRoot.querySelector("path");
      var value = /** @type {HTMLElement} */
      shadowRoot.querySelector("#percent-value");
      var offset = (100 - percent) / 100 * this.maxDashOffset;
      path.style.strokeDashoffset = String(offset);
      value.textContent = String(percent);
    } else {
      element.style.width = "".concat(percent, "%");
    }
    if (percent >= 100) {
      _assertClassBrand(_WebpackDevServerProgress_brand, this, _hide).call(this);
    } else if (percent > 0) {
      _assertClassBrand(_WebpackDevServerProgress_brand, this, _show).call(this);
    }
  }
  function _show() {
    var shadowRoot = /** @type {ShadowRoot} */this.shadowRoot;
    var element = /** @type {HTMLElement} */
    shadowRoot.querySelector("#progress");
    element.classList.remove("hidden");
  }
  function _hide() {
    var _this2 = this;
    var shadowRoot = /** @type {ShadowRoot} */this.shadowRoot;
    var element = /** @type {HTMLElement} */
    shadowRoot.querySelector("#progress");
    if (this.type === "circular") {
      element.classList.add("disappear");
      element.addEventListener("animationend", function () {
        element.classList.add("hidden");
        _assertClassBrand(_WebpackDevServerProgress_brand, _this2, _update).call(_this2, 0);
      }, {
        once: true
      });
    } else if (this.type === "linear") {
      element.classList.add("disappear");
      this.animationTimer = setTimeout(function () {
        element.classList.remove("disappear");
        element.classList.add("hidden");
        element.style.width = "0%";
        _this2.animationTimer = null;
      }, 800);
    }
  }
  customElements.define("wds-progress", WebpackDevServerProgress);
}
// EXTERNAL MODULE: ../node_modules/webpack-dev-server/client/clients/WebSocketClient.js
var WebSocketClient = __webpack_require__("../node_modules/webpack-dev-server/client/clients/WebSocketClient.js");
// EXTERNAL MODULE: ../node_modules/webpack-dev-server/client/utils/log.js
var utils_log = __webpack_require__("../node_modules/webpack-dev-server/client/utils/log.js");
;// ../node_modules/webpack-dev-server/client/socket.js
/* provided dependency */ var __webpack_dev_server_client__ = __webpack_require__("../node_modules/webpack-dev-server/client/clients/WebSocketClient.js");
/* global __webpack_dev_server_client__ */




/** @typedef {import("./index.js").EXPECTED_ANY} EXPECTED_ANY */
/** @typedef {import("./clients/SockJSClient")} SockJSClient */

// this WebsocketClient is here as a default fallback, in case the client is not injected
/** @type {CommunicationClientConstructor} */
var Client = typeof __webpack_dev_server_client__ !== "undefined" ? typeof (/** @type {{ default: CommunicationClientConstructor }} */
__webpack_dev_server_client__.default) !== "undefined" ? /** @type {{ default: CommunicationClientConstructor }} */
__webpack_dev_server_client__.default : (/** @type {CommunicationClientConstructor} */
__webpack_dev_server_client__) : WebSocketClient["default"];
var retries = 0;
var maxRetries = 10;

// Initialized client is exported so external consumers can utilize the same instance
// It is mutable to enforce singleton
/** @type {CommunicationClient | null} */
// eslint-disable-next-line import/no-mutable-exports
var client = null;

/** @type {ReturnType<typeof setTimeout> | undefined} */
var timeout;

/**
 * @param {string} url url
 * @param {{ [handler: string]: (data?: EXPECTED_ANY, params?: EXPECTED_ANY) => EXPECTED_ANY }} handlers handlers
 * @param {number=} reconnect count of reconnections
 */
function socket(url, handlers, reconnect) {
  client = new Client(url);
  client.onOpen(function () {
    retries = 0;
    if (timeout) {
      clearTimeout(timeout);
    }
    if (typeof reconnect !== "undefined") {
      maxRetries = reconnect;
    }
  });
  client.onClose(function () {
    if (retries === 0) {
      handlers.close();
    }

    // Try to reconnect.
    client = null;

    // After 10 retries stop trying, to prevent logspam.
    if (retries < maxRetries) {
      // Exponentially increase timeout to reconnect.
      // Respectfully copied from the package `got`.
      var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
      retries += 1;
      utils_log.log.info("Trying to reconnect...");
      timeout = setTimeout(function () {
        socket(url, handlers, reconnect);
      }, retryInMs);
    }
  });
  client.onMessage(
  /**
   * @param {EXPECTED_ANY} data data
   */
  function (data) {
    var message = JSON.parse(data);
    if (handlers[message.type]) {
      handlers[message.type](message.data, message.params);
    }
  });
}
/* harmony default export */ const client_socket = (socket);
;// ../node_modules/webpack-dev-server/client/utils/sendMessage.js
/* global WorkerGlobalScope */

/** @typedef {import("../index").EXPECTED_ANY} EXPECTED_ANY */

// Send messages to the outside, so plugins can consume it.
/**
 * @param {string} type type
 * @param {EXPECTED_ANY=} data data
 */
function sendMsg(type, data) {
  if (typeof self !== "undefined" && (typeof WorkerGlobalScope === "undefined" || !(self instanceof WorkerGlobalScope))) {
    self.postMessage({
      type: "webpack".concat(type),
      data: data
    }, "*");
  }
}
/* harmony default export */ const sendMessage = (sendMsg);
;// ../node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=localhost&port=4101&pathname=%2Fws&logging=info&overlay=%7B%22errors%22%3Atrue%2C%22warnings%22%3Afalse%7D&reconnect=10&hot=false&live-reload=true
var __resourceQuery = "?protocol=ws%3A&hostname=localhost&port=4101&pathname=%2Fws&logging=info&overlay=%7B%22errors%22%3Atrue%2C%22warnings%22%3Afalse%7D&reconnect=10&hot=false&live-reload=true";
function clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_ownKeys(Object(t), !0).forEach(function (r) { clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_defineProperty(e, r, t) { return (r = clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_toPropertyKey(t) { var i = clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_toPrimitive(t, "string"); return "symbol" == clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_typeof(i) ? i : i + ""; }
function clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_toPrimitive(t, r) { if ("object" != clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_typeof(o) { "@babel/helpers - typeof"; return clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_typeof(o); }
/* global __resourceQuery, __webpack_hash__ */
// @ts-expect-error

// @ts-expect-error







// eslint-disable-next-line jsdoc/no-restricted-syntax
/** @typedef {any} EXPECTED_ANY */

/**
 * @typedef {object} RawOverlayOptions
 * @property {string=} warnings warnings
 * @property {string=} errors errors
 * @property {string=} runtimeErrors runtime errors
 * @property {string=} trustedTypesPolicyName trusted types policy name
 */

/**
 * @typedef {object} OverlayOptions
 * @property {(boolean | ((error: Error) => boolean))=} warnings warnings
 * @property {(boolean | ((error: Error) => boolean))=} errors errors
 * @property {(boolean | ((error: Error) => boolean))=} runtimeErrors runtime errors
 * @property {string=} trustedTypesPolicyName trusted types policy name
 */

/** @typedef {false | true | "none" | "error" | "warn" | "info" | "log" | "verbose"} LogLevel */

/**
 * @typedef {object} Options
 * @property {boolean} hot true when hot enabled, otherwise false
 * @property {boolean} liveReload true when live reload enabled, otherwise false
 * @property {boolean} progress true when need to show progress, otherwise false
 * @property {boolean | OverlayOptions} overlay overlay options
 * @property {LogLevel=} logging logging level
 * @property {number=} reconnect count of allowed reconnection
 */

/**
 * @typedef {object} Status
 * @property {boolean} isUnloading true when unloaded, otherwise false
 * @property {string} currentHash current hash
 * @property {string=} previousHash previous hash
 */

/**
 * @param {boolean | RawOverlayOptions | OverlayOptions} overlayOptions overlay options
 */
var decodeOverlayOptions = function decodeOverlayOptions(overlayOptions) {
  if (clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_typeof(overlayOptions) === "object") {
    var requiredOptions = ["warnings", "errors", "runtimeErrors"];
    for (var i = 0; i < requiredOptions.length; i++) {
      var property = /** @type {keyof Omit<RawOverlayOptions, "trustedTypesPolicyName">} */
      requiredOptions[i];
      if (typeof overlayOptions[property] === "string") {
        var overlayFilterFunctionString = decodeURIComponent(overlayOptions[property]);

        /** @type {OverlayOptions} */
        overlayOptions[property] = /** @type {(error: Error) => boolean} */
        // eslint-disable-next-line no-new-func
        new Function("message", "var callback = ".concat(overlayFilterFunctionString, "\n        return callback(message)"));
      }
    }
  }
};

/**
 * @type {Status}
 */
var clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_status = {
  isUnloading: false,
  currentHash: __webpack_require__.h()
};

/**
 * @returns {string} current script source
 */
var getCurrentScriptSource = function getCurrentScriptSource() {
  // `document.currentScript` is the most accurate way to find the current script,
  // but is not supported in all browsers.
  if (document.currentScript) {
    return /** @type {string} */document.currentScript.getAttribute("src");
  }

  // Fallback to getting all scripts running in the document.
  var scriptElements = document.scripts || [];
  var scriptElementsWithSrc = Array.prototype.filter.call(scriptElements, function (element) {
    return element.getAttribute("src");
  });
  if (scriptElementsWithSrc.length > 0) {
    var currentScript = scriptElementsWithSrc[scriptElementsWithSrc.length - 1];
    return currentScript.getAttribute("src");
  }

  // Fail as there was no script to use.
  throw new Error("[webpack-dev-server] Failed to get current script source.");
};

/** @typedef {{ hot?: string, ["live-reload"]?: string, progress?: string, reconnect?: string, logging?: LogLevel, overlay?: string, fromCurrentScript?: boolean }} AdditionalParsedURL */
/** @typedef {Partial<URL> & AdditionalParsedURL} ParsedURL */

/**
 * @param {string} resourceQuery resource query
 * @returns {ParsedURL} parsed URL
 */
var parseURL = function parseURL(resourceQuery) {
  /** @type {ParsedURL} */
  var result = {};
  if (typeof resourceQuery === "string" && resourceQuery !== "") {
    var searchParams = resourceQuery.slice(1).split("&");
    for (var i = 0; i < searchParams.length; i++) {
      var pair = searchParams[i].split("=");

      /** @type {EXPECTED_ANY} */
      result[pair[0]] = decodeURIComponent(pair[1]);
    }
  } else {
    // Else, get the url from the <script> this file was called with.
    var scriptSource = getCurrentScriptSource();
    var scriptSourceURL;
    try {
      // The placeholder `baseURL` with `window.location.href`,
      // is to allow parsing of path-relative or protocol-relative URLs,
      // and will have no effect if `scriptSource` is a fully valid URL.
      scriptSourceURL = new URL(scriptSource, self.location.href);
    } catch (_err) {
      // URL parsing failed, do nothing.
      // We will still proceed to see if we can recover using `resourceQuery`
    }
    if (scriptSourceURL) {
      result = scriptSourceURL;
      result.fromCurrentScript = true;
    }
  }
  return result;
};
var parsedResourceQuery = parseURL(__resourceQuery);

/** @typedef {{ ["Hot Module Replacement"]: boolean, ["Live Reloading"]: boolean, Progress: boolean, Overlay: boolean }} Features */

/** @type {Features} */
var enabledFeatures = {
  "Hot Module Replacement": false,
  "Live Reloading": false,
  Progress: false,
  Overlay: false
};

/** @type {Options} */
var options = {
  hot: false,
  liveReload: false,
  progress: false,
  overlay: false
};
if (parsedResourceQuery.hot === "true") {
  options.hot = true;
  enabledFeatures["Hot Module Replacement"] = true;
}
if (parsedResourceQuery["live-reload"] === "true") {
  options.liveReload = true;
  enabledFeatures["Live Reloading"] = true;
}
if (parsedResourceQuery.progress === "true") {
  options.progress = true;
  enabledFeatures.Progress = true;
}
if (parsedResourceQuery.overlay) {
  try {
    options.overlay = JSON.parse(parsedResourceQuery.overlay);
  } catch (err) {
    utils_log.log.error("Error parsing overlay options from resource query:", err);
  }

  // Fill in default "true" params for partially-specified objects.
  if (clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_typeof(options.overlay) === "object") {
    options.overlay = clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_objectSpread({
      errors: true,
      warnings: true,
      runtimeErrors: true
    }, options.overlay);
    decodeOverlayOptions(options.overlay);
  }
  enabledFeatures.Overlay = options.overlay !== false;
}
if (parsedResourceQuery.logging) {
  options.logging = parsedResourceQuery.logging;
}
if (typeof parsedResourceQuery.reconnect !== "undefined") {
  options.reconnect = Number(parsedResourceQuery.reconnect);
}

/**
 * @param {false | true | "none" | "error" | "warn" | "info" | "log" | "verbose"} level level
 */
var setAllLogLevel = function setAllLogLevel(level) {
  // This is needed because the HMR logger operate separately from dev server logger
  log_default().setLogLevel(level === "verbose" || level === "log" ? "info" : level);
  (0,utils_log.setLogLevel)(level);
};
if (options.logging) {
  setAllLogLevel(options.logging);
}

/**
 * @param {Features} features features
 */
var logEnabledFeatures = function logEnabledFeatures(features) {
  var listEnabledFeatures = Object.keys(features);
  if (!features || listEnabledFeatures.length === 0) {
    return;
  }
  var logString = "Server started:";

  // Server started: Hot Module Replacement enabled, Live Reloading enabled, Overlay disabled.
  for (var i = 0; i < listEnabledFeatures.length; i++) {
    var key = /** @type {keyof Features} */listEnabledFeatures[i];
    logString += " ".concat(key, " ").concat(features[key] ? "enabled" : "disabled", ",");
  }
  // replace last comma with a period
  logString = logString.slice(0, -1).concat(".");
  utils_log.log.info(logString);
};
logEnabledFeatures(enabledFeatures);
self.addEventListener("beforeunload", function () {
  clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_status.isUnloading = true;
});
var overlay = typeof window !== "undefined" ? createOverlay(clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_typeof(options.overlay) === "object" ? {
  trustedTypesPolicyName: options.overlay.trustedTypesPolicyName,
  catchRuntimeError: options.overlay.runtimeErrors
} : {
  trustedTypesPolicyName: false,
  catchRuntimeError: options.overlay
}) : {
  send: function send() {}
};

/**
 * @param {Options} options options
 * @param {Status} currentStatus current status
 */
var reloadApp = function reloadApp(_ref, currentStatus) {
  var hot = _ref.hot,
    liveReload = _ref.liveReload;
  if (currentStatus.isUnloading) {
    return;
  }
  var currentHash = currentStatus.currentHash,
    previousHash = currentStatus.previousHash;
  var isInitial = currentHash.indexOf(/** @type {string} */previousHash) >= 0;
  if (isInitial) {
    return;
  }

  /**
   * @param {Window} rootWindow root window
   * @param {number} intervalId interval id
   */
  function applyReload(rootWindow, intervalId) {
    clearInterval(intervalId);
    utils_log.log.info("App updated. Reloading...");
    rootWindow.location.reload();
  }
  var search = self.location.search.toLowerCase();
  var allowToHot = search.indexOf("webpack-dev-server-hot=false") === -1;
  var allowToLiveReload = search.indexOf("webpack-dev-server-live-reload=false") === -1;
  if (hot && allowToHot) {
    utils_log.log.info("App hot update...");
    if (typeof EventTarget !== "undefined" && (emitter_default()) instanceof EventTarget) {
      var event = new CustomEvent("webpackHotUpdate", {
        detail: {
          currentHash: currentStatus.currentHash
        },
        bubbles: true,
        cancelable: false
      });
      emitter_default().dispatchEvent(event);
    } else {
      emitter_default().emit("webpackHotUpdate", currentStatus.currentHash);
    }
    if (typeof self !== "undefined" && self.window) {
      // broadcast update to window
      self.postMessage("webpackHotUpdate".concat(currentStatus.currentHash), "*");
    }
  }
  // allow refreshing the page only if liveReload isn't disabled
  else if (liveReload && allowToLiveReload) {
    /** @type {Window} */
    var rootWindow = self;

    // use parent window for reload (in case we're in an iframe with no valid src)
    var intervalId = self.setInterval(function () {
      if (rootWindow.location.protocol !== "about:") {
        // reload immediately if protocol is valid
        applyReload(rootWindow, intervalId);
      } else {
        rootWindow = rootWindow.parent;
        if (rootWindow.parent === rootWindow) {
          // if parent equals current window we've reached the root which would continue forever, so trigger a reload anyways
          applyReload(rootWindow, intervalId);
        }
      }
    });
  }
};
var ansiRegex = new RegExp(["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|"), "g");

/**
 * Strip [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code) from a string.
 * Adapted from code originally released by Sindre Sorhus
 * Licensed the MIT License
 * @param {string} string string
 * @returns {string} string without ansi
 */
var stripAnsi = function stripAnsi(string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a `string`, got `".concat(clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_typeof(string), "`"));
  }
  return string.replace(ansiRegex, "");
};
var onSocketMessage = {
  hot: function hot() {
    if (parsedResourceQuery.hot === "false") {
      return;
    }
    options.hot = true;
  },
  liveReload: function liveReload() {
    if (parsedResourceQuery["live-reload"] === "false") {
      return;
    }
    options.liveReload = true;
  },
  invalid: function invalid() {
    utils_log.log.info("App updated. Recompiling...");

    // Fixes #1042. overlay doesn't clear if errors are fixed but warnings remain.
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    sendMessage("Invalid");
  },
  /**
   * @param {string} hash hash
   */
  hash: function hash(_hash) {
    clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_status.previousHash = clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_status.currentHash;
    clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_status.currentHash = _hash;
  },
  logging: setAllLogLevel,
  /**
   * @param {boolean} value overlay value
   */
  overlay: function overlay(value) {
    if (typeof document === "undefined") {
      return;
    }
    options.overlay = value;
    decodeOverlayOptions(options.overlay);
  },
  /**
   * @param {number} value reconnect value
   */
  reconnect: function reconnect(value) {
    if (parsedResourceQuery.reconnect === "false") {
      return;
    }
    options.reconnect = value;
  },
  /**
   * @param {boolean} value progress value
   */
  progress: function progress(value) {
    options.progress = value;
  },
  /**
   * @param {{ pluginName?: string, percent: string, msg: string }} data date with progress
   */
  "progress-update": function progressUpdate(data) {
    if (options.progress) {
      utils_log.log.info("".concat(data.pluginName ? "[".concat(data.pluginName, "] ") : "").concat(data.percent, "% - ").concat(data.msg, "."));
    }
    if (isProgressSupported() && typeof options.progress === "string") {
      var progress = document.querySelector("wds-progress");
      if (!progress) {
        defineProgressElement();
        progress = document.createElement("wds-progress");
        document.body.appendChild(progress);
      }
      progress.setAttribute("progress", data.percent);
      progress.setAttribute("type", options.progress);
    }
    sendMessage("Progress", data);
  },
  "still-ok": function stillOk() {
    utils_log.log.info("Nothing changed.");
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    sendMessage("StillOk");
  },
  ok: function ok() {
    sendMessage("Ok");
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    reloadApp(options, clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_status);
  },
  /**
   * @param {string} file changed file
   */
  "static-changed": function staticChanged(file) {
    utils_log.log.info("".concat(file ? "\"".concat(file, "\"") : "Content", " from static directory was changed. Reloading..."));
    self.location.reload();
  },
  /**
   * @param {Error[]} warnings warnings
   * @param {{ preventReloading: boolean }=} params extra params
   */
  warnings: function warnings(_warnings, params) {
    utils_log.log.warn("Warnings while compiling.");
    var printableWarnings = _warnings.map(function (error) {
      var _formatProblem = formatProblem("warning", error),
        header = _formatProblem.header,
        body = _formatProblem.body;
      return "".concat(header, "\n").concat(stripAnsi(body));
    });
    sendMessage("Warnings", printableWarnings);
    for (var i = 0; i < printableWarnings.length; i++) {
      utils_log.log.warn(printableWarnings[i]);
    }
    var overlayWarningsSetting = typeof options.overlay === "boolean" ? options.overlay : options.overlay && options.overlay.warnings;
    if (overlayWarningsSetting) {
      var warningsToDisplay = typeof overlayWarningsSetting === "function" ? _warnings.filter(overlayWarningsSetting) : _warnings;
      if (warningsToDisplay.length) {
        overlay.send({
          type: "BUILD_ERROR",
          level: "warning",
          messages: _warnings
        });
      }
    }
    if (params && params.preventReloading) {
      return;
    }
    reloadApp(options, clientprotocol_ws_3A_hostname_localhost_port_4101_pathname_2Fws_logging_info_overlay_7B_22errors_22_3Atrue_2C_22warnings_22_3Afalse_7D_reconnect_10_hot_false_live_reload_true_status);
  },
  /**
   * @param {Error[]} errors errors
   */
  errors: function errors(_errors) {
    utils_log.log.error("Errors while compiling. Reload prevented.");
    var printableErrors = _errors.map(function (error) {
      var _formatProblem2 = formatProblem("error", error),
        header = _formatProblem2.header,
        body = _formatProblem2.body;
      return "".concat(header, "\n").concat(stripAnsi(body));
    });
    sendMessage("Errors", printableErrors);
    for (var i = 0; i < printableErrors.length; i++) {
      utils_log.log.error(printableErrors[i]);
    }
    var overlayErrorsSettings = typeof options.overlay === "boolean" ? options.overlay : options.overlay && options.overlay.errors;
    if (overlayErrorsSettings) {
      var errorsToDisplay = typeof overlayErrorsSettings === "function" ? _errors.filter(overlayErrorsSettings) : _errors;
      if (errorsToDisplay.length) {
        overlay.send({
          type: "BUILD_ERROR",
          level: "error",
          messages: _errors
        });
      }
    }
  },
  /**
   * @param {Error} error error
   */
  error: function error(_error) {
    utils_log.log.error(_error);
  },
  close: function close() {
    utils_log.log.info("Disconnected!");
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    sendMessage("Close");
  }
};

/**
 * @param {{ protocol?: string, auth?: string, hostname?: string, port?: string, pathname?: string, search?: string, hash?: string, slashes?: boolean }} objURL object URL
 * @returns {string} formatted url
 */
var formatURL = function formatURL(objURL) {
  var protocol = objURL.protocol || "";
  if (protocol && protocol.slice(-1) !== ":") {
    protocol += ":";
  }
  var auth = objURL.auth || "";
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ":");
    auth += "@";
  }
  var host = "";
  if (objURL.hostname) {
    host = auth + (objURL.hostname.indexOf(":") === -1 ? objURL.hostname : "[".concat(objURL.hostname, "]"));
    if (objURL.port) {
      host += ":".concat(objURL.port);
    }
  }
  var pathname = objURL.pathname || "";
  if (objURL.slashes) {
    host = "//".concat(host || "");
    if (pathname && pathname.charAt(0) !== "/") {
      pathname = "/".concat(pathname);
    }
  } else if (!host) {
    host = "";
  }
  var search = objURL.search || "";
  if (search && search.charAt(0) !== "?") {
    search = "?".concat(search);
  }
  var hash = objURL.hash || "";
  if (hash && hash.charAt(0) !== "#") {
    hash = "#".concat(hash);
  }
  pathname = pathname.replace(/[?#]/g,
  /**
   * @param {string} match matched string
   * @returns {string} encoded URI component
   */
  function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace("#", "%23");
  return "".concat(protocol).concat(host).concat(pathname).concat(search).concat(hash);
};

/**
 * @param {ParsedURL} parsedURL parsed URL
 * @returns {string} socket URL
 */
var createSocketURL = function createSocketURL(parsedURL) {
  var hostname = parsedURL.hostname;

  // Node.js module parses it as `::`
  // `new URL(urlString, [baseURLString])` parses it as '[::]'
  var isInAddrAny = hostname === "0.0.0.0" || hostname === "::" || hostname === "[::]";

  // why do we need this check?
  // hostname n/a for file protocol (example, when using electron, ionic)
  // see: https://github.com/webpack/webpack-dev-server/pull/384
  if (isInAddrAny && self.location.hostname && self.location.protocol.indexOf("http") === 0) {
    hostname = self.location.hostname;
  }
  var socketURLProtocol = parsedURL.protocol || self.location.protocol;

  // When https is used in the app, secure web sockets are always necessary because the browser doesn't accept non-secure web sockets.
  if (socketURLProtocol === "auto:" || hostname && isInAddrAny && self.location.protocol === "https:") {
    socketURLProtocol = self.location.protocol;
  }
  socketURLProtocol = socketURLProtocol.replace(/^(?:http|.+-extension|file)/i, "ws");
  var socketURLAuth = "";

  // `new URL(urlString, [baseURLstring])` doesn't have `auth` property
  // Parse authentication credentials in case we need them
  if (parsedURL.username) {
    socketURLAuth = parsedURL.username;

    // Since HTTP basic authentication does not allow empty username,
    // we only include password if the username is not empty.
    if (parsedURL.password) {
      // Result: <username>:<password>
      socketURLAuth = socketURLAuth.concat(":", parsedURL.password);
    }
  }

  // In case the host is a raw IPv6 address, it can be enclosed in
  // the brackets as the brackets are needed in the final URL string.
  // Need to remove those as url.format blindly adds its own set of brackets
  // if the host string contains colons. That would lead to non-working
  // double brackets (e.g. [[::]]) host
  //
  // All of these web socket url params are optionally passed in through resourceQuery,
  // so we need to fall back to the default if they are not provided
  var socketURLHostname = (hostname || self.location.hostname || "localhost").replace(/^\[(.*)\]$/, "$1");
  var socketURLPort = parsedURL.port;
  if (!socketURLPort || socketURLPort === "0") {
    socketURLPort = self.location.port;
  }

  // If path is provided it'll be passed in via the resourceQuery as a
  // query param so it has to be parsed out of the querystring in order for the
  // client to open the socket to the correct location.
  var socketURLPathname = "/ws";
  if (parsedURL.pathname && !parsedURL.fromCurrentScript) {
    socketURLPathname = parsedURL.pathname;
  }
  return formatURL({
    protocol: socketURLProtocol,
    auth: socketURLAuth,
    hostname: socketURLHostname,
    port: socketURLPort,
    pathname: socketURLPathname,
    slashes: true
  });
};
var socketURL = createSocketURL(parsedResourceQuery);
client_socket(socketURL, onSocketMessage, options.reconnect);


/***/ },

/***/ "../node_modules/webpack-dev-server/client/modules/logger/index.js"
(__unused_webpack_module, exports) {

/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client-src/modules/logger/tapable.js":
/*!**********************************************!*\
  !*** ./client-src/modules/logger/tapable.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_372__) {

__nested_webpack_require_372__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_372__.d(__nested_webpack_exports__, {
/* harmony export */   SyncBailHook: function() { return /* binding */ SyncBailHook; }
/* harmony export */ });
/**
 * @returns {SyncBailHook} mocked sync bail hook
 * @constructor
 */
function SyncBailHook() {
  return {
    call: function call() {}
  };
}

/**
 * Client stub for tapable SyncBailHook
 */


/***/ }),

/***/ "./node_modules/webpack/lib/logging/Logger.js":
/*!****************************************************!*\
  !*** ./node_modules/webpack/lib/logging/Logger.js ***!
  \****************************************************/
/***/ (function(module) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && "symbol" == typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && o.constructor === (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && o !== (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _iterableToArray(r) {
  if ("undefined" != typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && null != r[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var LogType = Object.freeze({
  error: (/** @type {"error"} */"error"),
  // message, c style arguments
  warn: (/** @type {"warn"} */"warn"),
  // message, c style arguments
  info: (/** @type {"info"} */"info"),
  // message, c style arguments
  log: (/** @type {"log"} */"log"),
  // message, c style arguments
  debug: (/** @type {"debug"} */"debug"),
  // message, c style arguments

  trace: (/** @type {"trace"} */"trace"),
  // no arguments

  group: (/** @type {"group"} */"group"),
  // [label]
  groupCollapsed: (/** @type {"groupCollapsed"} */"groupCollapsed"),
  // [label]
  groupEnd: (/** @type {"groupEnd"} */"groupEnd"),
  // [label]

  profile: (/** @type {"profile"} */"profile"),
  // [profileName]
  profileEnd: (/** @type {"profileEnd"} */"profileEnd"),
  // [profileName]

  time: (/** @type {"time"} */"time"),
  // name, time as [seconds, nanoseconds]

  clear: (/** @type {"clear"} */"clear"),
  // no arguments
  status: (/** @type {"status"} */"status") // message, arguments
});
module.exports.LogType = LogType;

/** @typedef {typeof LogType[keyof typeof LogType]} LogTypeEnum */

var LOG_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; })("webpack logger raw log method");
var TIMERS_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; })("webpack logger times");
var TIMERS_AGGREGATES_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; })("webpack logger aggregated times");

/** @typedef {EXPECTED_ANY[]} Args */
var WebpackLogger = /*#__PURE__*/function () {
  /**
   * @param {(type: LogTypeEnum, args?: Args) => void} log log function
   * @param {(name: string | (() => string)) => WebpackLogger} getChildLogger function to create child logger
   */
  function WebpackLogger(log, getChildLogger) {
    _classCallCheck(this, WebpackLogger);
    this[LOG_SYMBOL] = log;
    this.getChildLogger = getChildLogger;
  }

  /**
   * @param {Args} args args
   */
  return _createClass(WebpackLogger, [{
    key: "error",
    value: function error() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      this[LOG_SYMBOL](LogType.error, args);
    }

    /**
     * @param {Args} args args
     */
  }, {
    key: "warn",
    value: function warn() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      this[LOG_SYMBOL](LogType.warn, args);
    }

    /**
     * @param {Args} args args
     */
  }, {
    key: "info",
    value: function info() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      this[LOG_SYMBOL](LogType.info, args);
    }

    /**
     * @param {Args} args args
     */
  }, {
    key: "log",
    value: function log() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      this[LOG_SYMBOL](LogType.log, args);
    }

    /**
     * @param {Args} args args
     */
  }, {
    key: "debug",
    value: function debug() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      this[LOG_SYMBOL](LogType.debug, args);
    }

    /**
     * @param {EXPECTED_ANY} assertion assertion
     * @param {Args} args args
     */
  }, {
    key: "assert",
    value: function assert(assertion) {
      if (!assertion) {
        for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          args[_key6 - 1] = arguments[_key6];
        }
        this[LOG_SYMBOL](LogType.error, args);
      }
    }
  }, {
    key: "trace",
    value: function trace() {
      this[LOG_SYMBOL](LogType.trace, ["Trace"]);
    }
  }, {
    key: "clear",
    value: function clear() {
      this[LOG_SYMBOL](LogType.clear);
    }

    /**
     * @param {Args} args args
     */
  }, {
    key: "status",
    value: function status() {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }
      this[LOG_SYMBOL](LogType.status, args);
    }

    /**
     * @param {Args} args args
     */
  }, {
    key: "group",
    value: function group() {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }
      this[LOG_SYMBOL](LogType.group, args);
    }

    /**
     * @param {Args} args args
     */
  }, {
    key: "groupCollapsed",
    value: function groupCollapsed() {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }
      this[LOG_SYMBOL](LogType.groupCollapsed, args);
    }
  }, {
    key: "groupEnd",
    value: function groupEnd() {
      this[LOG_SYMBOL](LogType.groupEnd);
    }

    /**
     * @param {string=} label label
     */
  }, {
    key: "profile",
    value: function profile(label) {
      this[LOG_SYMBOL](LogType.profile, [label]);
    }

    /**
     * @param {string=} label label
     */
  }, {
    key: "profileEnd",
    value: function profileEnd(label) {
      this[LOG_SYMBOL](LogType.profileEnd, [label]);
    }

    /**
     * @param {string} label label
     */
  }, {
    key: "time",
    value: function time(label) {
      /** @type {Map<string | undefined, [number, number]>} */
      this[TIMERS_SYMBOL] = this[TIMERS_SYMBOL] || new Map();
      this[TIMERS_SYMBOL].set(label, process.hrtime());
    }

    /**
     * @param {string=} label label
     */
  }, {
    key: "timeLog",
    value: function timeLog(label) {
      var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
      if (!prev) {
        throw new Error("No such label '".concat(label, "' for WebpackLogger.timeLog()"));
      }
      var time = process.hrtime(prev);
      this[LOG_SYMBOL](LogType.time, [label].concat(_toConsumableArray(time)));
    }

    /**
     * @param {string=} label label
     */
  }, {
    key: "timeEnd",
    value: function timeEnd(label) {
      var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
      if (!prev) {
        throw new Error("No such label '".concat(label, "' for WebpackLogger.timeEnd()"));
      }
      var time = process.hrtime(prev);
      /** @type {Map<string | undefined, [number, number]>} */
      this[TIMERS_SYMBOL].delete(label);
      this[LOG_SYMBOL](LogType.time, [label].concat(_toConsumableArray(time)));
    }

    /**
     * @param {string=} label label
     */
  }, {
    key: "timeAggregate",
    value: function timeAggregate(label) {
      var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
      if (!prev) {
        throw new Error("No such label '".concat(label, "' for WebpackLogger.timeAggregate()"));
      }
      var time = process.hrtime(prev);
      /** @type {Map<string | undefined, [number, number]>} */
      this[TIMERS_SYMBOL].delete(label);
      /** @type {Map<string | undefined, [number, number]>} */
      this[TIMERS_AGGREGATES_SYMBOL] = this[TIMERS_AGGREGATES_SYMBOL] || new Map();
      var current = this[TIMERS_AGGREGATES_SYMBOL].get(label);
      if (current !== undefined) {
        if (time[1] + current[1] > 1e9) {
          time[0] += current[0] + 1;
          time[1] = time[1] - 1e9 + current[1];
        } else {
          time[0] += current[0];
          time[1] += current[1];
        }
      }
      this[TIMERS_AGGREGATES_SYMBOL].set(label, time);
    }

    /**
     * @param {string=} label label
     */
  }, {
    key: "timeAggregateEnd",
    value: function timeAggregateEnd(label) {
      if (this[TIMERS_AGGREGATES_SYMBOL] === undefined) return;
      var time = this[TIMERS_AGGREGATES_SYMBOL].get(label);
      if (time === undefined) return;
      this[TIMERS_AGGREGATES_SYMBOL].delete(label);
      this[LOG_SYMBOL](LogType.time, [label].concat(_toConsumableArray(time)));
    }
  }]);
}();
module.exports.Logger = WebpackLogger;

/***/ }),

/***/ "./node_modules/webpack/lib/logging/createConsoleLogger.js":
/*!*****************************************************************!*\
  !*** ./node_modules/webpack/lib/logging/createConsoleLogger.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __nested_webpack_require_12749__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && r[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _iterableToArray(r) {
  if ("undefined" != typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && null != r[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && "symbol" == typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && o.constructor === (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && o !== (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
var _require = __nested_webpack_require_12749__(/*! ./Logger */ "./node_modules/webpack/lib/logging/Logger.js"),
  LogType = _require.LogType;

/** @typedef {import("../../declarations/WebpackOptions").FilterItemTypes} FilterItemTypes */
/** @typedef {import("../../declarations/WebpackOptions").FilterTypes} FilterTypes */
/** @typedef {import("./Logger").LogTypeEnum} LogTypeEnum */
/** @typedef {import("./Logger").Args} Args */

/** @typedef {(item: string) => boolean} FilterFunction */
/** @typedef {(value: string, type: LogTypeEnum, args?: Args) => void} LoggingFunction */

/**
 * @typedef {object} LoggerConsole
 * @property {() => void} clear
 * @property {() => void} trace
 * @property {(...args: Args) => void} info
 * @property {(...args: Args) => void} log
 * @property {(...args: Args) => void} warn
 * @property {(...args: Args) => void} error
 * @property {(...args: Args) => void=} debug
 * @property {(...args: Args) => void=} group
 * @property {(...args: Args) => void=} groupCollapsed
 * @property {(...args: Args) => void=} groupEnd
 * @property {(...args: Args) => void=} status
 * @property {(...args: Args) => void=} profile
 * @property {(...args: Args) => void=} profileEnd
 * @property {(...args: Args) => void=} logTime
 */

/**
 * @typedef {object} LoggerOptions
 * @property {false|true|"none"|"error"|"warn"|"info"|"log"|"verbose"} level loglevel
 * @property {FilterTypes|boolean} debug filter for debug logging
 * @property {LoggerConsole} console the console to log to
 */

/**
 * @param {FilterItemTypes} item an input item
 * @returns {FilterFunction | undefined} filter function
 */
var filterToFunction = function filterToFunction(item) {
  if (typeof item === "string") {
    var regExp = new RegExp("[\\\\/]".concat(item.replace(/[-[\]{}()*+?.\\^$|]/g, "\\$&"), "([\\\\/]|$|!|\\?)"));
    return function (ident) {
      return regExp.test(ident);
    };
  }
  if (item && _typeof(item) === "object" && typeof item.test === "function") {
    return function (ident) {
      return item.test(ident);
    };
  }
  if (typeof item === "function") {
    return item;
  }
  if (typeof item === "boolean") {
    return function () {
      return item;
    };
  }
};

/**
 * @enum {number}
 */
var LogLevel = {
  none: 6,
  false: 6,
  error: 5,
  warn: 4,
  info: 3,
  log: 2,
  true: 2,
  verbose: 1
};

/**
 * @param {LoggerOptions} options options object
 * @returns {LoggingFunction} logging function
 */
module.exports = function (_ref) {
  var _ref$level = _ref.level,
    level = _ref$level === void 0 ? "info" : _ref$level,
    _ref$debug = _ref.debug,
    debug = _ref$debug === void 0 ? false : _ref$debug,
    console = _ref.console;
  var debugFilters = /** @type {FilterFunction[]} */

  typeof debug === "boolean" ? [function () {
    return debug;
  }] : /** @type {FilterItemTypes[]} */_toConsumableArray(Array.isArray(debug) ? debug : [debug]).map(filterToFunction);
  var loglevel = LogLevel["".concat(level)] || 0;

  /**
   * @param {string} name name of the logger
   * @param {LogTypeEnum} type type of the log entry
   * @param {Args=} args arguments of the log entry
   * @returns {void}
   */
  var logger = function logger(name, type, args) {
    var labeledArgs = function labeledArgs() {
      if (Array.isArray(args)) {
        if (args.length > 0 && typeof args[0] === "string") {
          return ["[".concat(name, "] ").concat(args[0])].concat(_toConsumableArray(args.slice(1)));
        }
        return ["[".concat(name, "]")].concat(_toConsumableArray(args));
      }
      return [];
    };
    var debug = debugFilters.some(function (f) {
      return f(name);
    });
    switch (type) {
      case LogType.debug:
        if (!debug) return;
        if (typeof console.debug === "function") {
          console.debug.apply(console, _toConsumableArray(labeledArgs()));
        } else {
          console.log.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.log:
        if (!debug && loglevel > LogLevel.log) return;
        console.log.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.info:
        if (!debug && loglevel > LogLevel.info) return;
        console.info.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.warn:
        if (!debug && loglevel > LogLevel.warn) return;
        console.warn.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.error:
        if (!debug && loglevel > LogLevel.error) return;
        console.error.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.trace:
        if (!debug) return;
        console.trace();
        break;
      case LogType.groupCollapsed:
        if (!debug && loglevel > LogLevel.log) return;
        if (!debug && loglevel > LogLevel.verbose) {
          if (typeof console.groupCollapsed === "function") {
            console.groupCollapsed.apply(console, _toConsumableArray(labeledArgs()));
          } else {
            console.log.apply(console, _toConsumableArray(labeledArgs()));
          }
          break;
        }
      // falls through
      case LogType.group:
        if (!debug && loglevel > LogLevel.log) return;
        if (typeof console.group === "function") {
          console.group.apply(console, _toConsumableArray(labeledArgs()));
        } else {
          console.log.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.groupEnd:
        if (!debug && loglevel > LogLevel.log) return;
        if (typeof console.groupEnd === "function") {
          console.groupEnd();
        }
        break;
      case LogType.time:
        {
          if (!debug && loglevel > LogLevel.log) return;
          var _args = _slicedToArray(/** @type {[string, number, number]} */
            args, 3),
            label = _args[0],
            start = _args[1],
            end = _args[2];
          var ms = start * 1000 + end / 1000000;
          var msg = "[".concat(name, "] ").concat(label, ": ").concat(ms, " ms");
          if (typeof console.logTime === "function") {
            console.logTime(msg);
          } else {
            console.log(msg);
          }
          break;
        }
      case LogType.profile:
        if (typeof console.profile === "function") {
          console.profile.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.profileEnd:
        if (typeof console.profileEnd === "function") {
          console.profileEnd.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.clear:
        if (!debug && loglevel > LogLevel.log) return;
        if (typeof console.clear === "function") {
          console.clear();
        }
        break;
      case LogType.status:
        if (!debug && loglevel > LogLevel.info) return;
        if (typeof console.status === "function") {
          if (!args || args.length === 0) {
            console.status();
          } else {
            console.status.apply(console, _toConsumableArray(labeledArgs()));
          }
        } else if (args && args.length !== 0) {
          console.info.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      default:
        throw new Error("Unexpected LogType ".concat(type));
    }
  };
  return logger;
};

/***/ }),

/***/ "./node_modules/webpack/lib/logging/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/webpack/lib/logging/runtime.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __nested_webpack_require_23673__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
var _require = __nested_webpack_require_23673__(/*! tapable */ "./client-src/modules/logger/tapable.js"),
  SyncBailHook = _require.SyncBailHook;
var _require2 = __nested_webpack_require_23673__(/*! ./Logger */ "./node_modules/webpack/lib/logging/Logger.js"),
  Logger = _require2.Logger;
var createConsoleLogger = __nested_webpack_require_23673__(/*! ./createConsoleLogger */ "./node_modules/webpack/lib/logging/createConsoleLogger.js");

/** @type {createConsoleLogger.LoggerOptions} */
var currentDefaultLoggerOptions = {
  level: "info",
  debug: false,
  console: console
};
var currentDefaultLogger = createConsoleLogger(currentDefaultLoggerOptions);

/**
 * @param {createConsoleLogger.LoggerOptions} options new options, merge with old options
 * @returns {void}
 */
module.exports.configureDefaultLogger = function (options) {
  _extends(currentDefaultLoggerOptions, options);
  currentDefaultLogger = createConsoleLogger(currentDefaultLoggerOptions);
};

/**
 * @param {string} name name of the logger
 * @returns {Logger} a logger
 */
module.exports.getLogger = function (name) {
  return new Logger(function (type, args) {
    if (module.exports.hooks.log.call(name, type, args) === undefined) {
      currentDefaultLogger(name, type, args);
    }
  }, function (childName) {
    return module.exports.getLogger("".concat(name, "/").concat(childName));
  });
};
module.exports.hooks = {
  log: new SyncBailHook(["origin", "type", "args"])
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_25750__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_25750__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_25750__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_25750__.o(definition, key) && !__nested_webpack_require_25750__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__nested_webpack_require_25750__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_25750__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __nested_webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
!function() {
/*!********************************************!*\
  !*** ./client-src/modules/logger/index.js ***!
  \********************************************/
__nested_webpack_require_25750__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_25750__.d(__nested_webpack_exports__, {
/* harmony export */   "default": function() { return /* reexport default export from named module */ webpack_lib_logging_runtime_js__WEBPACK_IMPORTED_MODULE_0__; }
/* harmony export */ });
/* harmony import */ var webpack_lib_logging_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_25750__(/*! webpack/lib/logging/runtime.js */ "./node_modules/webpack/lib/logging/runtime.js");
// @ts-expect-error

}();
var __webpack_export_target__ = exports;
for(var __webpack_i__ in __nested_webpack_exports__) __webpack_export_target__[__webpack_i__] = __nested_webpack_exports__[__webpack_i__];
if(__nested_webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;

/***/ },

/***/ "../node_modules/webpack-dev-server/client/utils/log.js"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   setLogLevel: () => (/* binding */ setLogLevel)
/* harmony export */ });
/* harmony import */ var _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/webpack-dev-server/client/modules/logger/index.js");
/* harmony import */ var _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0__);

var name = "webpack-dev-server";
// default level is set on the client side, so it does not need
// to be set by the CLI or API
var defaultLevel = "info";

// options new options, merge with old options
/**
 * @param {false | true | "none" | "error" | "warn" | "info" | "log" | "verbose"} level level
 * @returns {void}
 */
function setLogLevel(level) {
  _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default().configureDefaultLogger({
    level: level
  });
}
setLogLevel(defaultLevel);
var log = _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default().getLogger(name);


/***/ },

/***/ "../node_modules/webpack/hot/emitter.js"
(module, __unused_webpack_exports, __webpack_require__) {

var EventEmitter = __webpack_require__("../node_modules/events/events.js");
module.exports = new EventEmitter();


/***/ },

/***/ "../node_modules/webpack/hot/log.js"
(module) {

/** @typedef {"info" | "warning" | "error"} LogLevel */

/** @type {LogLevel} */
var logLevel = "info";

function dummy() {}

/**
 * @param {LogLevel} level log level
 * @returns {boolean} true, if should log
 */
function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

/**
 * @param {(msg?: string) => void} logFn log function
 * @returns {(level: LogLevel, msg?: string) => void} function that logs when log level is sufficient
 */
function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

/**
 * @param {LogLevel} level log level
 * @param {string|Error} msg message
 */
module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/**
 * @param {Error} err error
 * @returns {string} formatted error
 */
module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	}
	return stack;
};

var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

/**
 * @param {LogLevel} level log level
 */
module.exports.setLogLevel = function (level) {
	logLevel = level;
};


/***/ },

/***/ "../node_modules/ws/browser.js"
(module) {



// In browser environment, this module will not actually be used.
// Return a dummy object to prevent errors during bundling.
module.exports = class DummyWebSocket {
  constructor() {
    // Do nothing - this is a dummy for build time
  }
  static on() {}
  static emit() {}
  send() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
};



/***/ },

/***/ "webpack/container/entry/admin"
(__unused_webpack_module, exports, __webpack_require__) {

var moduleMap = {
	"./Module": () => {
		return Promise.all(/* __federation_expose_Module */[__webpack_require__.e("vendors-node_modules_tslib_tslib_es6_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_common_http_angular_common_http"), __webpack_require__.e("__federation_expose_Module")]).then(() => (() => ((__webpack_require__("./src/app/app.module.ts")))));
	}
};
var get = (module, getScope) => {
	__webpack_require__.R = getScope;
	getScope = (
		__webpack_require__.o(moduleMap, module)
			? moduleMap[module]()
			: Promise.resolve().then(() => {
				throw new Error('Module "' + module + '" does not exist in container.');
			})
	);
	__webpack_require__.R = undefined;
	return getScope;
};
var init = (shareScope, initScope, remoteEntryInitOptions) => {
	return __webpack_require__.federation.bundlerRuntime.initContainerEntry({	webpackRequire: __webpack_require__,
		shareScope: shareScope,
		initScope: initScope,
		remoteEntryInitOptions: remoteEntryInitOptions,
		shareScopeKey: "default"
	})
};


// This exports getters to disallow modifications
__webpack_require__.d(exports, {
	get: () => (get),
	init: () => (init)
});

/***/ }

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 	__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 	module = execOptions.module;
/******/ 	execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/******/ // expose the modules object (__webpack_modules__)
/******/ __webpack_require__.m = __webpack_modules__;
/******/ 
/******/ // expose the module cache
/******/ __webpack_require__.c = __webpack_module_cache__;
/******/ 
/******/ // expose the module execution interceptor
/******/ __webpack_require__.i = [];
/******/ 
/******/ // the startup function
/******/ __webpack_require__.x = x => {};
/************************************************************************/
/******/ /* webpack/runtime/federation runtime */
/******/ (() => {
/******/ 	if(!__webpack_require__.federation){
/******/ 		__webpack_require__.federation = {
/******/ 			initOptions: {"name":"admin","remotes":[],"shareStrategy":"version-first"},
/******/ 			chunkMatcher: function(chunkId) {return !/^webpack_sharing_consume_default_angular_(co(mmon_(angular_common|http_angular_common_http)|re_(angular_core|primitives_di_angular_core_primitives_di\-webpack\-da8972))|platform\-browser_angular_platform\-browser)$/.test(chunkId)},
/******/ 			rootOutputDir: "",
/******/ 			bundlerRuntimeOptions: { remotes: { remoteInfos: {}, webpackRequire: __webpack_require__,idToRemoteMap: {}, chunkMapping: {},idToExternalAndNameMapping: {} } }
/******/ 		};
/******/ 	__webpack_require__.consumesLoadingData = {}
/******/ 	__webpack_require__.remotesLoadingData = {}
/******/ 	}
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/ensure chunk */
/******/ (() => {
/******/ 	__webpack_require__.f = {};
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = (chunkId) => {
/******/ 		return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 			__webpack_require__.f[key](chunkId, promises);
/******/ 			return promises;
/******/ 		}, []));
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/get javascript chunk filename */
/******/ (() => {
/******/ 	// This function allow to reference async chunks
/******/ 	__webpack_require__.u = (chunkId) => {
/******/ 		// return url for filenames based on template
/******/ 		return "" + chunkId + ".js";
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("4af69e59cec01243")
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/sharing */
/******/ (() => {
/******/ 	__webpack_require__.S = {};
/******/ 	var initPromises = {};
/******/ 	var initTokens = {};
/******/ 	__webpack_require__.I = (name, initScope) => {
/******/ 		if(!initScope) initScope = [];
/******/ 		// handling circular init calls
/******/ 		var initToken = initTokens[name];
/******/ 		if(!initToken) initToken = initTokens[name] = {};
/******/ 		if(initScope.indexOf(initToken) >= 0) return;
/******/ 		initScope.push(initToken);
/******/ 		// only runs once
/******/ 		if(initPromises[name]) return initPromises[name];
/******/ 		// creates a new share scope if needed
/******/ 		if(!__webpack_require__.o(__webpack_require__.S, name)) __webpack_require__.S[name] = {};
/******/ 		// runs all init snippets from all modules reachable
/******/ 		var scope = __webpack_require__.S[name];
/******/ 		var warn = (msg) => {
/******/ 			if (typeof console !== "undefined" && console.warn) console.warn(msg);
/******/ 		};
/******/ 		var uniqueName = "admin";
/******/ 		var register = (name, version, factory, eager) => {
/******/ 			var versions = scope[name] = scope[name] || {};
/******/ 			var activeVersion = versions[version];
/******/ 			if(!activeVersion || (!activeVersion.loaded && (!eager != !activeVersion.eager ? eager : uniqueName > activeVersion.from))) versions[version] = { get: factory, from: uniqueName, eager: !!eager };
/******/ 		};
/******/ 		var initExternal = (id) => {
/******/ 			var handleError = (err) => (warn("Initialization of sharing external failed: " + err));
/******/ 			try {
/******/ 				var module = __webpack_require__(id);
/******/ 				if(!module) return;
/******/ 				var initFn = (module) => (module && module.init && module.init(__webpack_require__.S[name], initScope))
/******/ 				if(module.then) return promises.push(module.then(initFn, handleError));
/******/ 				var initResult = initFn(module);
/******/ 				if(initResult && initResult.then) return promises.push(initResult['catch'](handleError));
/******/ 			} catch(err) { handleError(err); }
/******/ 		}
/******/ 		var promises = [];
/******/ 		switch(name) {
/******/ 			case "default": {
/******/ 				register("@angular/animations/browser", "21.2.10", () => (Promise.all([__webpack_require__.e("vendors-node_modules_angular_animations_fesm2022_browser_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core")]).then(() => (() => (__webpack_require__("../node_modules/@angular/animations/fesm2022/browser.mjs"))))));
/******/ 				register("@angular/common/http", "21.2.10", () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_tslib_tslib_es6_mjs"), __webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_observable_of_js-node_modules_rxjs_dist_esm5_int-683476"), __webpack_require__.e("vendors-node_modules_angular_common_fesm2022_http_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core")]).then(() => (() => (__webpack_require__("../node_modules/@angular/common/fesm2022/http.mjs"))))));
/******/ 				register("@angular/common", "21.2.10", () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_tslib_tslib_es6_mjs"), __webpack_require__.e("vendors-node_modules_angular_common_fesm2022_common_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core")]).then(() => (() => (__webpack_require__("../node_modules/@angular/common/fesm2022/common.mjs"))))));
/******/ 				register("@angular/core/primitives/di", "21.2.10", () => (__webpack_require__.e("node_modules_angular_core_fesm2022_primitives-di_mjs-_c0830").then(() => (() => (__webpack_require__("../node_modules/@angular/core/fesm2022/primitives-di.mjs"))))));
/******/ 				register("@angular/core/primitives/signals", "21.2.10", () => (Promise.all([__webpack_require__.e("vendors-node_modules_angular_core_fesm2022__untracked-chunk_mjs-node_modules_angular_core_fes-a373a9"), __webpack_require__.e("node_modules_angular_core_fesm2022_primitives-signals_mjs-_e7580")]).then(() => (() => (__webpack_require__("../node_modules/@angular/core/fesm2022/primitives-signals.mjs"))))));
/******/ 				register("@angular/core", "21.2.10", () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_tslib_tslib_es6_mjs"), __webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_BehaviorSubject_js-node_modules_rxjs_dist_esm5_i-b1ddfe"), __webpack_require__.e("vendors-node_modules_angular_core_fesm2022__untracked-chunk_mjs-node_modules_angular_core_fes-a373a9"), __webpack_require__.e("vendors-node_modules_angular_core_fesm2022_core_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_primitives_di_angular_core_primitives_di-webpack-da8972")]).then(() => (() => (__webpack_require__("../node_modules/@angular/core/fesm2022/core.mjs"))))));
/******/ 				register("@angular/platform-browser-dynamic", "21.2.10", () => (Promise.all([__webpack_require__.e("vendors-node_modules_angular_platform-browser-dynamic_fesm2022_platform-browser-dynamic_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core"), __webpack_require__.e("webpack_sharing_consume_default_angular_platform-browser_angular_platform-browser")]).then(() => (() => (__webpack_require__("../node_modules/@angular/platform-browser-dynamic/fesm2022/platform-browser-dynamic.mjs"))))));
/******/ 				register("@angular/platform-browser/animations", "21.2.10", () => (Promise.all([__webpack_require__.e("vendors-node_modules_angular_platform-browser_fesm2022__browser-chunk_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core"), __webpack_require__.e("webpack_sharing_consume_default_angular_common_angular_common"), __webpack_require__.e("node_modules_angular_platform-browser_fesm2022_animations_mjs")]).then(() => (() => (__webpack_require__("../node_modules/@angular/platform-browser/fesm2022/animations.mjs"))))));
/******/ 				register("@angular/platform-browser", "21.2.10", () => (Promise.all([__webpack_require__.e("vendors-node_modules_angular_platform-browser_fesm2022__browser-chunk_mjs"), __webpack_require__.e("vendors-node_modules_angular_platform-browser_fesm2022_platform-browser_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core"), __webpack_require__.e("webpack_sharing_consume_default_angular_common_angular_common"), __webpack_require__.e("webpack_sharing_consume_default_angular_common_http_angular_common_http")]).then(() => (() => (__webpack_require__("../node_modules/@angular/platform-browser/fesm2022/platform-browser.mjs"))))));
/******/ 				register("@angular/router", "21.2.10", () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_tslib_tslib_es6_mjs"), __webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_BehaviorSubject_js-node_modules_rxjs_dist_esm5_i-b1ddfe"), __webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_observable_of_js-node_modules_rxjs_dist_esm5_int-683476"), __webpack_require__.e("vendors-node_modules_angular_router_fesm2022_router_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core"), __webpack_require__.e("webpack_sharing_consume_default_angular_common_angular_common"), __webpack_require__.e("webpack_sharing_consume_default_angular_platform-browser_angular_platform-browser")]).then(() => (() => (__webpack_require__("../node_modules/@angular/router/fesm2022/router.mjs"))))));
/******/ 			}
/******/ 			break;
/******/ 		}
/******/ 		if(!promises.length) return initPromises[name] = 1;
/******/ 		return initPromises[name] = Promise.all(promises).then(() => (initPromises[name] = 1));
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/sharing */
/******/ (() => {
/******/ 	__webpack_require__.federation.initOptions.shared = {	"@angular/animations/browser": [{	version: "21.2.10",
/******/ 			get: () => (Promise.all([__webpack_require__.e("vendors-node_modules_angular_animations_fesm2022_browser_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core")]).then(() => (() => (__webpack_require__("../node_modules/@angular/animations/fesm2022/browser.mjs"))))),
/******/ 			scope: ["default"],
/******/ 			shareConfig: {"eager":false,"requiredVersion":"^21.2.10","strictVersion":true,"singleton":true,"layer":null},
/******/ 		},],	"@angular/common/http": [{	version: "21.2.10",
/******/ 			get: () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_tslib_tslib_es6_mjs"), __webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_observable_of_js-node_modules_rxjs_dist_esm5_int-683476"), __webpack_require__.e("vendors-node_modules_angular_common_fesm2022_http_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core")]).then(() => (() => (__webpack_require__("../node_modules/@angular/common/fesm2022/http.mjs"))))),
/******/ 			scope: ["default"],
/******/ 			shareConfig: {"eager":false,"requiredVersion":"^21.2.10","strictVersion":true,"singleton":true,"layer":null},
/******/ 		},],	"@angular/common": [{	version: "21.2.10",
/******/ 			get: () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_tslib_tslib_es6_mjs"), __webpack_require__.e("vendors-node_modules_angular_common_fesm2022_common_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core")]).then(() => (() => (__webpack_require__("../node_modules/@angular/common/fesm2022/common.mjs"))))),
/******/ 			scope: ["default"],
/******/ 			shareConfig: {"eager":false,"strictVersion":true,"singleton":true,"layer":null},
/******/ 		},],	"@angular/core/primitives/di": [{	version: "21.2.10",
/******/ 			get: () => (__webpack_require__.e("node_modules_angular_core_fesm2022_primitives-di_mjs-_c0830").then(() => (() => (__webpack_require__("../node_modules/@angular/core/fesm2022/primitives-di.mjs"))))),
/******/ 			scope: ["default"],
/******/ 			shareConfig: {"eager":false,"requiredVersion":"^21.2.10","strictVersion":true,"singleton":true,"layer":null},
/******/ 		},],	"@angular/core/primitives/signals": [{	version: "21.2.10",
/******/ 			get: () => (Promise.all([__webpack_require__.e("vendors-node_modules_angular_core_fesm2022__untracked-chunk_mjs-node_modules_angular_core_fes-a373a9"), __webpack_require__.e("node_modules_angular_core_fesm2022_primitives-signals_mjs-_e7580")]).then(() => (() => (__webpack_require__("../node_modules/@angular/core/fesm2022/primitives-signals.mjs"))))),
/******/ 			scope: ["default"],
/******/ 			shareConfig: {"eager":false,"requiredVersion":"^21.2.10","strictVersion":true,"singleton":true,"layer":null},
/******/ 		},],	"@angular/core": [{	version: "21.2.10",
/******/ 			get: () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_tslib_tslib_es6_mjs"), __webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_BehaviorSubject_js-node_modules_rxjs_dist_esm5_i-b1ddfe"), __webpack_require__.e("vendors-node_modules_angular_core_fesm2022__untracked-chunk_mjs-node_modules_angular_core_fes-a373a9"), __webpack_require__.e("vendors-node_modules_angular_core_fesm2022_core_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_primitives_di_angular_core_primitives_di-webpack-da8972")]).then(() => (() => (__webpack_require__("../node_modules/@angular/core/fesm2022/core.mjs"))))),
/******/ 			scope: ["default"],
/******/ 			shareConfig: {"eager":false,"strictVersion":true,"singleton":true,"layer":null},
/******/ 		},],	"@angular/platform-browser-dynamic": [{	version: "21.2.10",
/******/ 			get: () => (Promise.all([__webpack_require__.e("vendors-node_modules_angular_platform-browser-dynamic_fesm2022_platform-browser-dynamic_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core"), __webpack_require__.e("webpack_sharing_consume_default_angular_platform-browser_angular_platform-browser")]).then(() => (() => (__webpack_require__("../node_modules/@angular/platform-browser-dynamic/fesm2022/platform-browser-dynamic.mjs"))))),
/******/ 			scope: ["default"],
/******/ 			shareConfig: {"eager":false,"strictVersion":true,"singleton":true,"layer":null},
/******/ 		},],	"@angular/platform-browser/animations": [{	version: "21.2.10",
/******/ 			get: () => (Promise.all([__webpack_require__.e("vendors-node_modules_angular_platform-browser_fesm2022__browser-chunk_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core"), __webpack_require__.e("webpack_sharing_consume_default_angular_common_angular_common"), __webpack_require__.e("node_modules_angular_platform-browser_fesm2022_animations_mjs")]).then(() => (() => (__webpack_require__("../node_modules/@angular/platform-browser/fesm2022/animations.mjs"))))),
/******/ 			scope: ["default"],
/******/ 			shareConfig: {"eager":false,"requiredVersion":"^21.2.10","strictVersion":true,"singleton":true,"layer":null},
/******/ 		},],	"@angular/platform-browser": [{	version: "21.2.10",
/******/ 			get: () => (Promise.all([__webpack_require__.e("vendors-node_modules_angular_platform-browser_fesm2022__browser-chunk_mjs"), __webpack_require__.e("vendors-node_modules_angular_platform-browser_fesm2022_platform-browser_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core"), __webpack_require__.e("webpack_sharing_consume_default_angular_common_angular_common"), __webpack_require__.e("webpack_sharing_consume_default_angular_common_http_angular_common_http")]).then(() => (() => (__webpack_require__("../node_modules/@angular/platform-browser/fesm2022/platform-browser.mjs"))))),
/******/ 			scope: ["default"],
/******/ 			shareConfig: {"eager":false,"strictVersion":true,"singleton":true,"layer":null},
/******/ 		},],	"@angular/router": [{	version: "21.2.10",
/******/ 			get: () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_tslib_tslib_es6_mjs"), __webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_BehaviorSubject_js-node_modules_rxjs_dist_esm5_i-b1ddfe"), __webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_observable_of_js-node_modules_rxjs_dist_esm5_int-683476"), __webpack_require__.e("vendors-node_modules_angular_router_fesm2022_router_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core"), __webpack_require__.e("webpack_sharing_consume_default_angular_common_angular_common"), __webpack_require__.e("webpack_sharing_consume_default_angular_platform-browser_angular_platform-browser")]).then(() => (() => (__webpack_require__("../node_modules/@angular/router/fesm2022/router.mjs"))))),
/******/ 			scope: ["default"],
/******/ 			shareConfig: {"eager":false,"strictVersion":true,"singleton":true,"layer":null},
/******/ 		},],}
/******/ 	__webpack_require__.S = {};
/******/ 	var initPromises = {};
/******/ 	var initTokens = {};
/******/ 	__webpack_require__.I = (name, initScope) => {
/******/ 		return __webpack_require__.federation.bundlerRuntime.I({	shareScopeName: name,
/******/ 			webpackRequire: __webpack_require__,
/******/ 			initPromises: initPromises,
/******/ 			initTokens: initTokens,
/******/ 			initScope: initScope,
/******/ 		})
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/consumes */
/******/ (() => {
/******/ 	var installedModules = {};
/******/ 	__webpack_require__.consumesLoadingData.moduleIdToConsumeDataMapping = {
/******/ 		"webpack/sharing/consume/default/@angular/core/@angular/core?dc51": {
/******/ 			fallback: () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_tslib_tslib_es6_mjs"), __webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_BehaviorSubject_js-node_modules_rxjs_dist_esm5_i-b1ddfe"), __webpack_require__.e("vendors-node_modules_angular_core_fesm2022__untracked-chunk_mjs-node_modules_angular_core_fes-a373a9"), __webpack_require__.e("vendors-node_modules_angular_core_fesm2022_core_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_primitives_di_angular_core_primitives_di-webpack-da8972")]).then(() => (() => (__webpack_require__("../node_modules/@angular/core/fesm2022/core.mjs"))))),
/******/ 			shareScope: ["default"],
/******/ 			singleton: true,
/******/ 			requiredVersion: "21.2.10",
/******/ 			strictVersion: true,
/******/ 			eager: false,
/******/ 			layer: undefined,
/******/ 			shareKey: "@angular/core",
/******/ 	
/******/ 		},
/******/ 		"webpack/sharing/consume/default/@angular/core/primitives/signals/@angular/core/primitives/signals": {
/******/ 			fallback: () => (__webpack_require__.e("node_modules_angular_core_fesm2022_primitives-signals_mjs-_e7581").then(() => (() => (__webpack_require__("../node_modules/@angular/core/fesm2022/primitives-signals.mjs"))))),
/******/ 			shareScope: ["default"],
/******/ 			singleton: true,
/******/ 			requiredVersion: "^21.2.10",
/******/ 			strictVersion: true,
/******/ 			eager: false,
/******/ 			layer: undefined,
/******/ 			shareKey: "@angular/core/primitives/signals",
/******/ 	
/******/ 		},
/******/ 		"webpack/sharing/consume/default/@angular/core/primitives/di/@angular/core/primitives/di": {
/******/ 			fallback: () => (__webpack_require__.e("node_modules_angular_core_fesm2022_primitives-di_mjs-_c0831").then(() => (() => (__webpack_require__("../node_modules/@angular/core/fesm2022/primitives-di.mjs"))))),
/******/ 			shareScope: ["default"],
/******/ 			singleton: true,
/******/ 			requiredVersion: "^21.2.10",
/******/ 			strictVersion: true,
/******/ 			eager: false,
/******/ 			layer: undefined,
/******/ 			shareKey: "@angular/core/primitives/di",
/******/ 	
/******/ 		},
/******/ 		"webpack/sharing/consume/default/@angular/platform-browser/@angular/platform-browser": {
/******/ 			fallback: () => (Promise.all([__webpack_require__.e("vendors-node_modules_angular_platform-browser_fesm2022__browser-chunk_mjs"), __webpack_require__.e("vendors-node_modules_angular_platform-browser_fesm2022_platform-browser_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_common_angular_common"), __webpack_require__.e("webpack_sharing_consume_default_angular_common_http_angular_common_http")]).then(() => (() => (__webpack_require__("../node_modules/@angular/platform-browser/fesm2022/platform-browser.mjs"))))),
/******/ 			shareScope: ["default"],
/******/ 			singleton: true,
/******/ 			requiredVersion: "21.2.10",
/******/ 			strictVersion: true,
/******/ 			eager: false,
/******/ 			layer: undefined,
/******/ 			shareKey: "@angular/platform-browser",
/******/ 	
/******/ 		},
/******/ 		"webpack/sharing/consume/default/@angular/common/@angular/common?6d8a": {
/******/ 			fallback: () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_tslib_tslib_es6_mjs"), __webpack_require__.e("vendors-node_modules_angular_common_fesm2022_common_mjs")]).then(() => (() => (__webpack_require__("../node_modules/@angular/common/fesm2022/common.mjs"))))),
/******/ 			shareScope: ["default"],
/******/ 			singleton: true,
/******/ 			requiredVersion: "21.2.10",
/******/ 			strictVersion: true,
/******/ 			eager: false,
/******/ 			layer: undefined,
/******/ 			shareKey: "@angular/common",
/******/ 	
/******/ 		},
/******/ 		"webpack/sharing/consume/default/@angular/animations/browser/@angular/animations/browser": {
/******/ 			fallback: () => (__webpack_require__.e("vendors-node_modules_angular_animations_fesm2022_browser_mjs").then(() => (() => (__webpack_require__("../node_modules/@angular/animations/fesm2022/browser.mjs"))))),
/******/ 			shareScope: ["default"],
/******/ 			singleton: true,
/******/ 			requiredVersion: "^21.2.10",
/******/ 			strictVersion: true,
/******/ 			eager: false,
/******/ 			layer: undefined,
/******/ 			shareKey: "@angular/animations/browser",
/******/ 	
/******/ 		},
/******/ 		"webpack/sharing/consume/default/@angular/common/http/@angular/common/http": {
/******/ 			fallback: () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_tslib_tslib_es6_mjs"), __webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_observable_of_js-node_modules_rxjs_dist_esm5_int-683476"), __webpack_require__.e("vendors-node_modules_angular_common_fesm2022_http_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core")]).then(() => (() => (__webpack_require__("../node_modules/@angular/common/fesm2022/http.mjs"))))),
/******/ 			shareScope: ["default"],
/******/ 			singleton: true,
/******/ 			requiredVersion: "^21.2.10",
/******/ 			strictVersion: true,
/******/ 			eager: false,
/******/ 			layer: undefined,
/******/ 			shareKey: "@angular/common/http",
/******/ 	
/******/ 		},
/******/ 		"webpack/sharing/consume/default/@angular/core/@angular/core?9ff1": {
/******/ 			fallback: () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_BehaviorSubject_js-node_modules_rxjs_dist_esm5_i-b1ddfe"), __webpack_require__.e("vendors-node_modules_angular_core_fesm2022__untracked-chunk_mjs-node_modules_angular_core_fes-a373a9"), __webpack_require__.e("vendors-node_modules_angular_core_fesm2022_core_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_primitives_di_angular_core_primitives_di-webpack-da8972")]).then(() => (() => (__webpack_require__("../node_modules/@angular/core/fesm2022/core.mjs"))))),
/******/ 			shareScope: ["default"],
/******/ 			singleton: true,
/******/ 			requiredVersion: "^21.2.10",
/******/ 			strictVersion: true,
/******/ 			eager: false,
/******/ 			layer: undefined,
/******/ 			shareKey: "@angular/core",
/******/ 	
/******/ 		},
/******/ 		"webpack/sharing/consume/default/@angular/platform-browser/animations/@angular/platform-browser/animations": {
/******/ 			fallback: () => (Promise.all([__webpack_require__.e("vendors-node_modules_angular_platform-browser_fesm2022__browser-chunk_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core"), __webpack_require__.e("webpack_sharing_consume_default_angular_common_angular_common"), __webpack_require__.e("node_modules_angular_platform-browser_fesm2022_animations_mjs")]).then(() => (() => (__webpack_require__("../node_modules/@angular/platform-browser/fesm2022/animations.mjs"))))),
/******/ 			shareScope: ["default"],
/******/ 			singleton: true,
/******/ 			requiredVersion: "^21.2.10",
/******/ 			strictVersion: true,
/******/ 			eager: false,
/******/ 			layer: undefined,
/******/ 			shareKey: "@angular/platform-browser/animations",
/******/ 	
/******/ 		},
/******/ 		"webpack/sharing/consume/default/@angular/router/@angular/router": {
/******/ 			fallback: () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_BehaviorSubject_js-node_modules_rxjs_dist_esm5_i-b1ddfe"), __webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_observable_of_js-node_modules_rxjs_dist_esm5_int-683476"), __webpack_require__.e("vendors-node_modules_angular_router_fesm2022_router_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core"), __webpack_require__.e("webpack_sharing_consume_default_angular_common_angular_common"), __webpack_require__.e("webpack_sharing_consume_default_angular_platform-browser_angular_platform-browser")]).then(() => (() => (__webpack_require__("../node_modules/@angular/router/fesm2022/router.mjs"))))),
/******/ 			shareScope: ["default"],
/******/ 			singleton: true,
/******/ 			requiredVersion: "^21.2.10",
/******/ 			strictVersion: true,
/******/ 			eager: false,
/******/ 			layer: undefined,
/******/ 			shareKey: "@angular/router",
/******/ 	
/******/ 		},
/******/ 		"webpack/sharing/consume/default/@angular/common/@angular/common?5e87": {
/******/ 			fallback: () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs_dist_esm5_internal_Observable_js"), __webpack_require__.e("vendors-node_modules_angular_common_fesm2022_common_mjs"), __webpack_require__.e("webpack_sharing_consume_default_angular_core_angular_core")]).then(() => (() => (__webpack_require__("../node_modules/@angular/common/fesm2022/common.mjs"))))),
/******/ 			shareScope: ["default"],
/******/ 			singleton: true,
/******/ 			requiredVersion: "^21.2.10",
/******/ 			strictVersion: true,
/******/ 			eager: false,
/******/ 			layer: undefined,
/******/ 			shareKey: "@angular/common",
/******/ 	
/******/ 		}
/******/ 	};
/******/ 	var moduleToHandlerMapping = {};
/******/ 	// no consumes in initial chunks
/******/ 	__webpack_require__.consumesLoadingData.chunkMapping = {
/******/ 		"webpack_sharing_consume_default_angular_core_angular_core": [
/******/ 			"webpack/sharing/consume/default/@angular/core/@angular/core?dc51"
/******/ 		],
/******/ 		"webpack_sharing_consume_default_angular_core_primitives_di_angular_core_primitives_di-webpack-da8972": [
/******/ 			"webpack/sharing/consume/default/@angular/core/primitives/signals/@angular/core/primitives/signals",
/******/ 			"webpack/sharing/consume/default/@angular/core/primitives/di/@angular/core/primitives/di"
/******/ 		],
/******/ 		"webpack_sharing_consume_default_angular_platform-browser_angular_platform-browser": [
/******/ 			"webpack/sharing/consume/default/@angular/platform-browser/@angular/platform-browser"
/******/ 		],
/******/ 		"webpack_sharing_consume_default_angular_common_angular_common": [
/******/ 			"webpack/sharing/consume/default/@angular/common/@angular/common?6d8a"
/******/ 		],
/******/ 		"node_modules_angular_platform-browser_fesm2022_animations_mjs": [
/******/ 			"webpack/sharing/consume/default/@angular/animations/browser/@angular/animations/browser"
/******/ 		],
/******/ 		"webpack_sharing_consume_default_angular_common_http_angular_common_http": [
/******/ 			"webpack/sharing/consume/default/@angular/common/http/@angular/common/http"
/******/ 		],
/******/ 		"__federation_expose_Module": [
/******/ 			"webpack/sharing/consume/default/@angular/core/@angular/core?9ff1",
/******/ 			"webpack/sharing/consume/default/@angular/platform-browser/animations/@angular/platform-browser/animations",
/******/ 			"webpack/sharing/consume/default/@angular/router/@angular/router"
/******/ 		],
/******/ 		"src_app_modules_dashboard_dashboard_module_ts": [
/******/ 			"webpack/sharing/consume/default/@angular/common/@angular/common?5e87"
/******/ 		]
/******/ 	};
/******/ 	__webpack_require__.f.consumes = (chunkId, promises) => {
/******/ 		__webpack_require__.federation.bundlerRuntime.consumes({
/******/ 		chunkMapping: __webpack_require__.consumesLoadingData.chunkMapping,
/******/ 		installedModules: installedModules,
/******/ 		chunkId: chunkId,
/******/ 		moduleToHandlerMapping,
/******/ 		promises: promises,
/******/ 		webpackRequire:__webpack_require__
/******/ 		});
/******/ 	}
/******/ })();
/******/ 
/******/ /* webpack/runtime/embed/federation */
/******/ (() => {
/******/ 	var prevStartup = __webpack_require__.x;
/******/ 	var hasRun = false;
/******/ 	__webpack_require__.x = () => {
/******/ 		if (!hasRun) {
/******/ 		  hasRun = true;
/******/ 		  __webpack_require__("../node_modules/.federation/entry.95a9b3ff803c35eac759343ab00542c2.js");
/******/ 		}
/******/ 		if (typeof prevStartup === 'function') {
/******/ 		  return prevStartup();
/******/ 		} else {
/******/ 		  console.warn('[Module Federation] prevStartup is not a function, skipping startup execution');
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/import chunk loading */
/******/ (() => {
/******/ 	// no baseURI
/******/ 	
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// [resolve, Promise] = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"admin": 0
/******/ 	};
/******/ 	
/******/ 	var installChunk = (data) => {
/******/ 		var {__webpack_esm_ids__, __webpack_esm_modules__, __webpack_esm_runtime__} = data;
/******/ 		// add "modules" to the modules object,
/******/ 		// then flag all "ids" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0;
/******/ 		for(moduleId in __webpack_esm_modules__) {
/******/ 			if(__webpack_require__.o(__webpack_esm_modules__, moduleId)) {
/******/ 				__webpack_require__.m[moduleId] = __webpack_esm_modules__[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(__webpack_esm_runtime__) __webpack_esm_runtime__(__webpack_require__);
/******/ 		for(;i < __webpack_esm_ids__.length; i++) {
/******/ 			chunkId = __webpack_esm_ids__[i];
/******/ 			if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				installedChunks[chunkId][0]();
/******/ 			}
/******/ 			installedChunks[__webpack_esm_ids__[i]] = 0;
/******/ 		}
/******/ 	
/******/ 	}
/******/ 	
/******/ 	__webpack_require__.f.j = (chunkId, promises) => {
/******/ 			// import() chunk loading for javascript
/******/ 			var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 			if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 	
/******/ 				// a Promise means "currently loading".
/******/ 				if(installedChunkData) {
/******/ 					promises.push(installedChunkData[1]);
/******/ 				} else {
/******/ 					if(!/^webpack_sharing_consume_default_angular_(co(mmon_(angular_common|http_angular_common_http)|re_(angular_core|primitives_di_angular_core_primitives_di\-webpack\-da8972))|platform\-browser_angular_platform\-browser)$/.test(chunkId)) {
/******/ 						// setup Promise in chunk cache
/******/ 						var promise = import("./" + __webpack_require__.u(chunkId)).then(installChunk, (e) => {
/******/ 							if(installedChunks[chunkId] !== 0) installedChunks[chunkId] = undefined;
/******/ 							throw e;
/******/ 						});
/******/ 						var promise = Promise.race([promise, new Promise((resolve) => (installedChunkData = installedChunks[chunkId] = [resolve]))])
/******/ 						promises.push(installedChunkData[1] = promise);
/******/ 					} else installedChunks[chunkId] = 0;
/******/ 				}
/******/ 			}
/******/ 	};
/******/ 	
/******/ 	// no prefetching
/******/ 	
/******/ 	// no preloaded
/******/ 	
/******/ 	// no external install chunk
/******/ 	
/******/ 	// no on chunks loaded
/******/ 	// no HMR
/******/ 	
/******/ 	// no HMR manifest
/******/ })();
/******/ 
/************************************************************************/
/******/ // run runtime startup
/******/ __webpack_require__.x();
/******/ // module cache are used so entry inlining is disabled
/******/ // startup
/******/ // Load entry module and return exports
/******/ __webpack_require__("../node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=localhost&port=4101&pathname=%2Fws&logging=info&overlay=%7B%22errors%22%3Atrue%2C%22warnings%22%3Afalse%7D&reconnect=10&hot=false&live-reload=true");
/******/ var __webpack_exports__ = __webpack_require__("webpack/container/entry/admin");
/******/ const __webpack_exports__get = __webpack_exports__.get;
/******/ const __webpack_exports__init = __webpack_exports__.init;
/******/ export { __webpack_exports__get as get, __webpack_exports__init as init };
/******/ 

//# sourceMappingURL=remoteEntry.mjs.map