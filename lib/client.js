window.__ModuleLoader__.load({ id: "dsh-yuyi", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
const react = __toESM(require("react"));
const __deepseek_ai_dsh_client_ui_primitives = __toESM(require("@deepseek-ai/dsh-client-ui-primitives"));
const react_jsx_runtime = __toESM(require("react/jsx-runtime"));

//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
var _a$1;
function $constructor(name, initializer$2, params) {
	function init(inst, def) {
		if (!inst._zod) Object.defineProperty(inst, "_zod", {
			value: {
				def,
				constr: _,
				traits: new Set()
			},
			enumerable: false
		});
		if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer$2(inst, def);
		const proto = _.prototype;
		const keys = Object.keys(proto);
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		var _a$2;
		const inst = params?.Parent ? new Definition() : this;
		init(inst, def);
		(_a$2 = inst._zod).deferred ?? (_a$2.deferred = []);
		for (const fn of inst._zod.deferred) fn();
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
const $brand = Symbol("zod_brand");
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
var $ZodEncodeError = class extends Error {
	constructor(name) {
		super(`Encountered unidirectional transform during encode: ${name}`);
		this.name = "ZodEncodeError";
	}
};
(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
const globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
	return values;
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
function cached(getter) {
	const set = false;
	return { get value() {
		if (!set) {
			const value = getter();
			Object.defineProperty(this, "value", { value });
			return value;
		}
		throw new Error("cached value already set");
	} };
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const ratio = val / step;
	const roundedRatio = Math.round(ratio);
	const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
	if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
	return ratio - roundedRatio;
}
const EVALUATING = /* @__PURE__ */ Symbol("evaluating");
function defineLazy(object$1, key, getter) {
	let value = void 0;
	Object.defineProperty(object$1, key, {
		get() {
			if (value === EVALUATING) return void 0;
			if (value === void 0) {
				value = EVALUATING;
				value = getter();
			}
			return value;
		},
		set(v) {
			Object.defineProperty(object$1, key, { value: v });
		},
		configurable: true
	});
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
function mergeDefs(...defs) {
	const mergedDescriptors = {};
	for (const def of defs) {
		const descriptors = Object.getOwnPropertyDescriptors(def);
		Object.assign(mergedDescriptors, descriptors);
	}
	return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
	return JSON.stringify(str);
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
const allowsEval = /* @__PURE__ */ cached(() => {
	if (globalConfig.jitless) return false;
	if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
	try {
		const F = Function;
		new F("");
		return true;
	} catch (_) {
		return false;
	}
});
function isPlainObject(o) {
	if (isObject(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject(o)) return { ...o };
	if (Array.isArray(o)) return [...o];
	if (o instanceof Map) return new Map(o);
	if (o instanceof Set) return new Set(o);
	return o;
}
const propertyKeyTypes = /* @__PURE__ */ new Set([
	"string",
	"number",
	"symbol"
]);
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
	});
}
const NUMBER_FORMAT_RANGES = {
	safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function pick(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	const hasChecks = checks && checks.length > 0;
	if (hasChecks) throw new Error(".pick() cannot be used on object schemas containing refinements");
	const def = mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = {};
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				newShape[key] = currDef.shape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	});
	return clone(schema, def);
}
function omit(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	const hasChecks = checks && checks.length > 0;
	if (hasChecks) throw new Error(".omit() cannot be used on object schemas containing refinements");
	const def = mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = { ...schema._zod.def.shape };
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				delete newShape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	});
	return clone(schema, def);
}
function extend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
	const checks = schema._zod.def.checks;
	const hasChecks = checks && checks.length > 0;
	if (hasChecks) {
		const existingShape = schema._zod.def.shape;
		for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	const def = mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} });
	return clone(schema, def);
}
function safeExtend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
	const def = mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} });
	return clone(schema, def);
}
function merge(a, b) {
	if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	const def = mergeDefs(a._zod.def, {
		get shape() {
			const _shape = {
				...a._zod.def.shape,
				...b._zod.def.shape
			};
			assignProp(this, "shape", _shape);
			return _shape;
		},
		get catchall() {
			return b._zod.def.catchall;
		},
		checks: b._zod.def.checks ?? []
	});
	return clone(a, def);
}
function partial(Class, schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	const hasChecks = checks && checks.length > 0;
	if (hasChecks) throw new Error(".partial() cannot be used on object schemas containing refinements");
	const def = mergeDefs(schema._zod.def, {
		get shape() {
			const oldShape = schema._zod.def.shape;
			const shape = { ...oldShape };
			if (mask) for (const key in mask) {
				if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				shape[key] = Class ? new Class({
					type: "optional",
					innerType: oldShape[key]
				}) : oldShape[key];
			}
			else for (const key in oldShape) shape[key] = Class ? new Class({
				type: "optional",
				innerType: oldShape[key]
			}) : oldShape[key];
			assignProp(this, "shape", shape);
			return shape;
		},
		checks: []
	});
	return clone(schema, def);
}
function required(Class, schema, mask) {
	const def = mergeDefs(schema._zod.def, { get shape() {
		const oldShape = schema._zod.def.shape;
		const shape = { ...oldShape };
		if (mask) for (const key in mask) {
			if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
			if (!mask[key]) continue;
			shape[key] = new Class({
				type: "nonoptional",
				innerType: oldShape[key]
			});
		}
		else for (const key in oldShape) shape[key] = new Class({
			type: "nonoptional",
			innerType: oldShape[key]
		});
		assignProp(this, "shape", shape);
		return shape;
	} });
	return clone(schema, def);
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function explicitlyAborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a$2;
		(_a$2 = iss).path ?? (_a$2.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config$1) {
	const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config$1.customError?.(iss)) ?? unwrapMessage(config$1.localeError?.(iss)) ?? "Invalid input";
	const { inst: _inst, continue: _continue, input: _input,...rest } = iss;
	rest.path ?? (rest.path = []);
	rest.message = message;
	if (ctx?.reportInput) rest.input = _input;
	return rest;
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
function issue(...args) {
	const [iss, input, inst] = args;
	if (typeof iss === "string") return {
		message: iss,
		code: "custom",
		input,
		inst
	};
	return { ...iss };
}

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
const initializer$1 = (inst, def) => {
	inst.name = "$ZodError";
	Object.defineProperty(inst, "_zod", {
		value: inst._zod,
		enumerable: false
	});
	Object.defineProperty(inst, "issues", {
		value: def,
		enumerable: false
	});
	inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
	Object.defineProperty(inst, "toString", {
		value: () => inst.message,
		enumerable: false
	});
};
const $ZodError = $constructor("$ZodError", initializer$1);
const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
function flattenError(error, mapper = (issue$1) => issue$1.message) {
	const fieldErrors = {};
	const formErrors = [];
	for (const sub of error.issues) if (sub.path.length > 0) {
		fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
		fieldErrors[sub.path[0]].push(mapper(sub));
	} else formErrors.push(mapper(sub));
	return {
		formErrors,
		fieldErrors
	};
}
function formatError(error, mapper = (issue$1) => issue$1.message) {
	const fieldErrors = { _errors: [] };
	const processError = (error$1, path = []) => {
		for (const issue$1 of error$1.issues) if (issue$1.code === "invalid_union" && issue$1.errors.length) issue$1.errors.map((issues) => processError({ issues }, [...path, ...issue$1.path]));
		else if (issue$1.code === "invalid_key") processError({ issues: issue$1.issues }, [...path, ...issue$1.path]);
		else if (issue$1.code === "invalid_element") processError({ issues: issue$1.issues }, [...path, ...issue$1.path]);
		else {
			const fullpath = [...path, ...issue$1.path];
			if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue$1));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < fullpath.length) {
					const el = fullpath[i];
					const terminal = i === fullpath.length - 1;
					if (!terminal) curr[el] = curr[el] || { _errors: [] };
					else {
						curr[el] = curr[el] || { _errors: [] };
						curr[el]._errors.push(mapper(issue$1));
					}
					curr = curr[el];
					i++;
				}
			}
		}
	};
	processError(error);
	return fieldErrors;
}

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
const _parse = (_Err) => (schema, value, _ctx, _params) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	if (result.issues.length) {
		const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, _params?.callee);
		throw e;
	}
	return result.value;
};
const parse$1 = /* @__PURE__ */ _parse($ZodRealError);
const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	if (result.issues.length) {
		const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, params?.callee);
		throw e;
	}
	return result.value;
};
const parseAsync$1 = /* @__PURE__ */ _parseAsync($ZodRealError);
const _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? {
		success: false,
		error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
const safeParse$1 = /* @__PURE__ */ _safeParse($ZodRealError);
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? {
		success: false,
		error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
const safeParseAsync$1 = /* @__PURE__ */ _safeParseAsync($ZodRealError);
const _encode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _parse(_Err)(schema, value, ctx);
};
const encode$1 = /* @__PURE__ */ _encode($ZodRealError);
const _decode = (_Err) => (schema, value, _ctx) => {
	return _parse(_Err)(schema, value, _ctx);
};
const decode$1 = /* @__PURE__ */ _decode($ZodRealError);
const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _parseAsync(_Err)(schema, value, ctx);
};
const encodeAsync$1 = /* @__PURE__ */ _encodeAsync($ZodRealError);
const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _parseAsync(_Err)(schema, value, _ctx);
};
const decodeAsync$1 = /* @__PURE__ */ _decodeAsync($ZodRealError);
const _safeEncode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParse(_Err)(schema, value, ctx);
};
const safeEncode$1 = /* @__PURE__ */ _safeEncode($ZodRealError);
const _safeDecode = (_Err) => (schema, value, _ctx) => {
	return _safeParse(_Err)(schema, value, _ctx);
};
const safeDecode$1 = /* @__PURE__ */ _safeDecode($ZodRealError);
const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParseAsync(_Err)(schema, value, ctx);
};
const safeEncodeAsync$1 = /* @__PURE__ */ _safeEncodeAsync($ZodRealError);
const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _safeParseAsync(_Err)(schema, value, _ctx);
};
const safeDecodeAsync$1 = /* @__PURE__ */ _safeDecodeAsync($ZodRealError);

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/regexes.js
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const cuid = /^[cC][0-9a-z]{6,}$/;
const cuid2 = /^[0-9a-z]+$/;
const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
const xid = /^[0-9a-vA-V]{20}$/;
const ksuid = /^[A-Za-z0-9]{27}$/;
const nanoid = /^[a-zA-Z0-9_-]{21}$/;
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 9562/4122 UUID.
*
* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
const uuid = (version$1) => {
	if (!version$1) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version$1}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
/** Practical email validation */
const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
	return new RegExp(_emoji$1, "u");
}
const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url = /^[A-Za-z0-9_-]*$/;
const httpProtocol = /^https?$/;
const e164 = /^\+[1-9]\d{6,14}$/;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
const date$1 = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args) {
	const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
	return regex;
}
function time$1(args) {
	return new RegExp(`^${timeSource(args)}$`);
}
function datetime$1(args) {
	const time$2 = timeSource({ precision: args.precision });
	const opts = ["Z"];
	if (args.local) opts.push("");
	if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	const timeRegex = `${time$2}(?:${opts.join("|")})`;
	return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
const string$1 = (params) => {
	const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
	return new RegExp(`^${regex}$`);
};
const integer = /^-?\d+$/;
const number$1 = /^-?\d+(?:\.\d+)?$/;
const boolean$1 = /^(?:true|false)$/i;
const _undefined$2 = /^undefined$/i;
const lowercase = /^[^A-Z]*$/;
const uppercase = /^[^a-z]*$/;

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/checks.js
const $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
	var _a$2;
	inst._zod ?? (inst._zod = {});
	inst._zod.def = def;
	(_a$2 = inst._zod).onattach ?? (_a$2.onattach = []);
});
const numericOriginMap = {
	number: "number",
	bigint: "bigint",
	object: "date"
};
const $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
		if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
		else bag.exclusiveMaximum = def.value;
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
		if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
		else bag.exclusiveMinimum = def.value;
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst$1) => {
		var _a$2;
		(_a$2 = inst$1._zod.bag).multipleOf ?? (_a$2.multipleOf = def.value);
	});
	inst._zod.check = (payload) => {
		if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
		const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0;
		if (isMultiple) return;
		payload.issues.push({
			origin: typeof payload.value,
			code: "not_multiple_of",
			divisor: def.value,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
	$ZodCheck.init(inst, def);
	def.format = def.format || "float64";
	const isInt = def.format?.includes("int");
	const origin = isInt ? "int" : "number";
	const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		bag.format = def.format;
		bag.minimum = minimum;
		bag.maximum = maximum;
		if (isInt) bag.pattern = integer;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (isInt) {
			if (!Number.isInteger(input)) {
				payload.issues.push({
					expected: origin,
					format: def.format,
					code: "invalid_type",
					continue: false,
					input,
					inst
				});
				return;
			}
			if (!Number.isSafeInteger(input)) {
				if (input > 0) payload.issues.push({
					input,
					code: "too_big",
					maximum: Number.MAX_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				else payload.issues.push({
					input,
					code: "too_small",
					minimum: Number.MIN_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				return;
			}
		}
		if (input < minimum) payload.issues.push({
			origin: "number",
			input,
			code: "too_small",
			minimum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
		if (input > maximum) payload.issues.push({
			origin: "number",
			input,
			code: "too_big",
			maximum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
	var _a$2;
	$ZodCheck.init(inst, def);
	(_a$2 = inst._zod.def).when ?? (_a$2.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst$1) => {
		const curr = inst$1._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
		if (def.maximum < curr) inst$1._zod.bag.maximum = def.maximum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const length = input.length;
		if (length <= def.maximum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: def.maximum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
	var _a$2;
	$ZodCheck.init(inst, def);
	(_a$2 = inst._zod.def).when ?? (_a$2.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst$1) => {
		const curr = inst$1._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
		if (def.minimum > curr) inst$1._zod.bag.minimum = def.minimum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const length = input.length;
		if (length >= def.minimum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: def.minimum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
	var _a$2;
	$ZodCheck.init(inst, def);
	(_a$2 = inst._zod.def).when ?? (_a$2.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		bag.minimum = def.length;
		bag.maximum = def.length;
		bag.length = def.length;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const length = input.length;
		if (length === def.length) return;
		const origin = getLengthableOrigin(input);
		const tooBig = length > def.length;
		payload.issues.push({
			origin,
			...tooBig ? {
				code: "too_big",
				maximum: def.length
			} : {
				code: "too_small",
				minimum: def.length
			},
			inclusive: true,
			exact: true,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
	var _a$2, _b;
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		bag.format = def.format;
		if (def.pattern) {
			bag.patterns ?? (bag.patterns = new Set());
			bag.patterns.add(def.pattern);
		}
	});
	if (def.pattern) (_a$2 = inst._zod).check ?? (_a$2.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: def.format,
			input: payload.value,
			...def.pattern ? { pattern: def.pattern.toString() } : {},
			inst,
			continue: !def.abort
		});
	});
	else (_b = inst._zod).check ?? (_b.check = () => {});
});
const $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: payload.value,
			pattern: def.pattern.toString(),
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
	def.pattern ?? (def.pattern = lowercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
	def.pattern ?? (def.pattern = uppercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
	$ZodCheck.init(inst, def);
	const escapedRegex = escapeRegex(def.includes);
	const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
	def.pattern = pattern;
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		bag.patterns ?? (bag.patterns = new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.includes(def.includes, def.position)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: def.includes,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		bag.patterns ?? (bag.patterns = new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.startsWith(def.prefix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: def.prefix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		bag.patterns ?? (bag.patterns = new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.endsWith(def.suffix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: def.suffix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		payload.value = def.tx(payload.value);
	};
});

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/doc.js
var Doc = class {
	constructor(args = []) {
		this.content = [];
		this.indent = 0;
		if (this) this.args = args;
	}
	indented(fn) {
		this.indent += 1;
		fn(this);
		this.indent -= 1;
	}
	write(arg) {
		if (typeof arg === "function") {
			arg(this, { execution: "sync" });
			arg(this, { execution: "async" });
			return;
		}
		const content = arg;
		const lines = content.split("\n").filter((x) => x);
		const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
		const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
		for (const line of dedented) this.content.push(line);
	}
	compile() {
		const F = Function;
		const args = this?.args;
		const content = this?.content ?? [``];
		const lines = [...content.map((x) => `  ${x}`)];
		return new F(...args, lines.join("\n"));
	}
};

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/versions.js
const version = {
	major: 4,
	minor: 4,
	patch: 3
};

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/schemas.js
const $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
	var _a$2;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version;
	const checks = [...inst._zod.def.checks ?? []];
	if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a$2 = inst._zod).deferred ?? (_a$2.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks$1, ctx) => {
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks$1) {
				if (ch._zod.def.when) {
					if (explicitlyAborted(payload)) continue;
					const shouldRun = ch._zod.def.when(payload);
					if (!shouldRun) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					const nextLen = payload.issues.length;
					if (nextLen === currLen) return;
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					const nextLen = payload.issues.length;
					if (nextLen === currLen) continue;
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx);
			if (checkResult instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult$1) => inst._zod.parse(checkResult$1, ctx));
			}
			return inst._zod.parse(checkResult, ctx);
		};
		inst._zod.run = (payload, ctx) => {
			if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
			if (ctx.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary$1) => {
					return handleCanaryResult(canary$1, payload, ctx);
				});
				return handleCanaryResult(canary, payload, ctx);
			}
			const result = inst._zod.parse(payload, ctx);
			if (result instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return result.then((result$1) => runChecks(result$1, checks, ctx));
			}
			return runChecks(result, checks, ctx);
		};
	}
	defineLazy(inst, "~standard", () => ({
		validate: (value) => {
			try {
				const r = safeParse$1(inst, value);
				return r.success ? { value: r.data } : { issues: r.error?.issues };
			} catch (_) {
				return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
});
const $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_$1) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
const $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	$ZodString.init(inst, def);
});
const $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
	def.pattern ?? (def.pattern = guid);
	$ZodStringFormat.init(inst, def);
});
const $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
	if (def.version) {
		const versionMap = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		};
		const v = versionMap[def.version];
		if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
		def.pattern ?? (def.pattern = uuid(v));
	} else def.pattern ?? (def.pattern = uuid());
	$ZodStringFormat.init(inst, def);
});
const $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
	def.pattern ?? (def.pattern = email);
	$ZodStringFormat.init(inst, def);
});
const $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		try {
			const trimmed = payload.value.trim();
			if (!def.normalize && def.protocol?.source === httpProtocol.source) {
				if (!/^https?:\/\//i.test(trimmed)) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid URL format",
						input: payload.value,
						inst,
						continue: !def.abort
					});
					return;
				}
			}
			const url = new URL(trimmed);
			if (def.hostname) {
				def.hostname.lastIndex = 0;
				if (!def.hostname.test(url.hostname)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid hostname",
					pattern: def.hostname.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.protocol) {
				def.protocol.lastIndex = 0;
				if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid protocol",
					pattern: def.protocol.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.normalize) payload.value = url.href;
			else payload.value = trimmed;
			return;
		} catch (_) {
			payload.issues.push({
				code: "invalid_format",
				format: "url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
const $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
	def.pattern ?? (def.pattern = emoji());
	$ZodStringFormat.init(inst, def);
});
const $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
	def.pattern ?? (def.pattern = nanoid);
	$ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
	def.pattern ?? (def.pattern = cuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
	def.pattern ?? (def.pattern = cuid2);
	$ZodStringFormat.init(inst, def);
});
const $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
	def.pattern ?? (def.pattern = ulid);
	$ZodStringFormat.init(inst, def);
});
const $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
	def.pattern ?? (def.pattern = xid);
	$ZodStringFormat.init(inst, def);
});
const $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
	def.pattern ?? (def.pattern = ksuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
	def.pattern ?? (def.pattern = datetime$1(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
	def.pattern ?? (def.pattern = date$1);
	$ZodStringFormat.init(inst, def);
});
const $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
	def.pattern ?? (def.pattern = time$1(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
	def.pattern ?? (def.pattern = duration$1);
	$ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
	def.pattern ?? (def.pattern = ipv4);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv4`;
});
const $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
	def.pattern ?? (def.pattern = ipv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv6`;
	inst._zod.check = (payload) => {
		try {
			new URL(`http://[${payload.value}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "ipv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
const $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv4);
	$ZodStringFormat.init(inst, def);
});
const $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		const parts = payload.value.split("/");
		try {
			if (parts.length !== 2) throw new Error();
			const [address, prefix] = parts;
			if (!prefix) throw new Error();
			const prefixNum = Number(prefix);
			if (`${prefixNum}` !== prefix) throw new Error();
			if (prefixNum < 0 || prefixNum > 128) throw new Error();
			new URL(`http://[${address}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "cidrv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
function isValidBase64(data) {
	if (data === "") return true;
	if (/\s/.test(data)) return false;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch {
		return false;
	}
}
const $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
	def.pattern ?? (def.pattern = base64);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64";
	inst._zod.check = (payload) => {
		if (isValidBase64(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
function isValidBase64URL(data) {
	if (!base64url.test(data)) return false;
	const base64$1 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	const padded = base64$1.padEnd(Math.ceil(base64$1.length / 4) * 4, "=");
	return isValidBase64(padded);
}
const $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
	def.pattern ?? (def.pattern = base64url);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64url";
	inst._zod.check = (payload) => {
		if (isValidBase64URL(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
	def.pattern ?? (def.pattern = e164);
	$ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch {
		return false;
	}
}
const $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidJWT(payload.value, def.alg)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Number(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
		const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
		payload.issues.push({
			expected: "number",
			code: "invalid_type",
			input,
			inst,
			...received ? { received } : {}
		});
		return payload;
	};
});
const $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
	$ZodCheckNumberFormat.init(inst, def);
	$ZodNumber.init(inst, def);
});
const $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = boolean$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Boolean(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "boolean") return payload;
		payload.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
const $ZodUndefined = /* @__PURE__ */ $constructor("$ZodUndefined", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = _undefined$2;
	inst._zod.values = new Set([void 0]);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (typeof input === "undefined") return payload;
		payload.issues.push({
			expected: "undefined",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
const $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
const $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		payload.issues.push({
			expected: "never",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
const $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = Array(input.length);
		const proms = [];
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result$1) => handleArrayResult(result$1, payload, i)));
			else handleArrayResult(result, payload, i);
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
	const isPresent = key in input;
	if (result.issues.length) {
		if (isOptionalIn && isOptionalOut && !isPresent) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (!isPresent && !isOptionalIn) {
		if (!result.issues.length) final.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [key]
		});
		return;
	}
	if (result.value === void 0) {
		if (isPresent) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		keys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const isOptionalIn = _catchall.optin === "optional";
	const isOptionalOut = _catchall.optout === "optional";
	for (const key in input) {
		if (key === "__proto__") continue;
		if (keySet.has(key)) continue;
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r$1) => handlePropertyResult(r$1, payload, key, input, isOptionalIn, isOptionalOut)));
		else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
const $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	const desc = Object.getOwnPropertyDescriptor(def, "shape");
	if (!desc?.get) {
		const sh = def.shape;
		Object.defineProperty(def, "shape", { get: () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			return newSh;
		} });
	}
	const _normalized = cached(() => normalizeDef(def));
	defineLazy(inst._zod, "propValues", () => {
		const shape = def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				propValues[key] ?? (propValues[key] = new Set());
				for (const v of field.values) propValues[key].add(v);
			}
		}
		return propValues;
	});
	const isObject$1 = isObject;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$1(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = {};
		const proms = [];
		const shape = value.shape;
		for (const key of value.keys) {
			const el = shape[key];
			const isOptionalIn = el._zod.optin === "optional";
			const isOptionalOut = el._zod.optout === "optional";
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r$1) => handlePropertyResult(r$1, payload, key, input, isOptionalIn, isOptionalOut)));
			else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
	};
});
const $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
	$ZodObject.init(inst, def);
	const superParse = inst._zod.parse;
	const _normalized = cached(() => normalizeDef(def));
	const generateFastpass = (shape) => {
		const doc = new Doc([
			"shape",
			"payload",
			"ctx"
		]);
		const normalized = _normalized.value;
		const parseStr = (key) => {
			const k = esc(key);
			return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
		};
		doc.write(`const input = payload.value;`);
		const ids = Object.create(null);
		let counter = 0;
		for (const key of normalized.keys) ids[key] = `key_${counter++}`;
		doc.write(`const newResult = {};`);
		for (const key of normalized.keys) {
			const id = ids[key];
			const k = esc(key);
			const schema = shape[key];
			const isOptionalIn = schema?._zod?.optin === "optional";
			const isOptionalOut = schema?._zod?.optout === "optional";
			doc.write(`const ${id} = ${parseStr(key)};`);
			if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
			else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
			else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
		}
		doc.write(`payload.value = newResult;`);
		doc.write(`return payload;`);
		const fn = doc.compile();
		return (payload, ctx) => fn(shape, payload, ctx);
	};
	let fastpass;
	const isObject$1 = isObject;
	const jit = !globalConfig.jitless;
	const allowsEval$1 = allowsEval;
	const fastEnabled = jit && allowsEval$1.value;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$1(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
			if (!fastpass) fastpass = generateFastpass(def.shape);
			payload = fastpass(payload, ctx);
			if (!catchall) return payload;
			return handleCatchall([], input, payload, ctx, value, inst);
		}
		return superParse(payload, ctx);
	};
});
function handleUnionResults(results, final, inst, ctx) {
	for (const result of results) if (result.issues.length === 0) {
		final.value = result.value;
		return final;
	}
	const nonaborted = results.filter((r) => !aborted(r));
	if (nonaborted.length === 1) {
		final.value = nonaborted[0].value;
		return nonaborted[0];
	}
	final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	});
	return final;
}
const $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "values", () => {
		if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
		return void 0;
	});
	defineLazy(inst._zod, "pattern", () => {
		if (def.options.every((o) => o._zod.pattern)) {
			const patterns = def.options.map((o) => o._zod.pattern);
			return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
		}
		return void 0;
	});
	const first = def.options.length === 1 ? def.options[0]._zod.run : null;
	inst._zod.parse = (payload, ctx) => {
		if (first) return first(payload, ctx);
		let async = false;
		const results = [];
		for (const option of def.options) {
			const result = option._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) {
				results.push(result);
				async = true;
			} else {
				if (result.issues.length === 0) return result;
				results.push(result);
			}
		}
		if (!async) return handleUnionResults(results, payload, inst, ctx);
		return Promise.all(results).then((results$1) => {
			return handleUnionResults(results$1, payload, inst, ctx);
		});
	};
});
const $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		const left = def.left._zod.run({
			value: input,
			issues: []
		}, ctx);
		const right = def.right._zod.run({
			value: input,
			issues: []
		}, ctx);
		const async = left instanceof Promise || right instanceof Promise;
		if (async) return Promise.all([left, right]).then(([left$1, right$1]) => {
			return handleIntersectionResults(payload, left$1, right$1);
		});
		return handleIntersectionResults(payload, left, right);
	};
});
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject(a) && isPlainObject(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		for (const key of sharedKeys) {
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
function handleIntersectionResults(result, left, right) {
	const unrecKeys = new Map();
	let unrecIssue;
	for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
		unrecIssue ?? (unrecIssue = iss);
		for (const k of iss.keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k).l = true;
		}
	} else result.issues.push(iss);
	for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
		if (!unrecKeys.has(k)) unrecKeys.set(k, {});
		unrecKeys.get(k).r = true;
	}
	else result.issues.push(iss);
	const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
	if (bothKeys.length && unrecIssue) result.issues.push({
		...unrecIssue,
		keys: bothKeys
	});
	if (aborted(result)) return result;
	const merged = mergeValues(left.value, right.value);
	if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
	result.value = merged.data;
	return result;
}
const $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (valuesSet.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
	$ZodType.init(inst, def);
	if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
	const values = new Set(def.values);
	inst._zod.values = values;
	inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (values.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values: def.values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		const _out = def.transform(payload.value, payload);
		if (ctx.async) {
			const output = _out instanceof Promise ? _out : Promise.resolve(_out);
			return output.then((output$1) => {
				payload.value = output$1;
				payload.fallback = true;
				return payload;
			});
		}
		if (_out instanceof Promise) throw new $ZodAsyncError();
		payload.value = _out;
		payload.fallback = true;
		return payload;
	};
});
function handleOptionalResult(result, input) {
	if (input === void 0 && (result.issues.length || result.fallback)) return {
		issues: [],
		value: void 0
	};
	return result;
}
const $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	inst._zod.optout = "optional";
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? new Set([...def.innerType._zod.values, void 0]) : void 0;
	});
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (def.innerType._zod.optin === "optional") {
			const input = payload.value;
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
			return handleOptionalResult(result, input);
		}
		if (payload.value === void 0) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
	inst._zod.parse = (payload, ctx) => {
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
	});
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === null) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) {
			payload.value = def.defaultValue;
			/**
			* $ZodDefault returns the default value immediately in forward direction.
			* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
			return payload;
		}
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result$1) => handleDefaultResult(result$1, def));
		return handleDefaultResult(result, def);
	};
});
function handleDefaultResult(payload, def) {
	if (payload.value === void 0) payload.value = def.defaultValue;
	return payload;
}
const $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) payload.value = def.defaultValue;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => {
		const v = def.innerType._zod.values;
		return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result$1) => handleNonOptionalResult(result$1, inst));
		return handleNonOptionalResult(result, inst);
	};
});
function handleNonOptionalResult(payload, inst) {
	if (!payload.issues.length && payload.value === void 0) payload.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: payload.value,
		inst
	});
	return payload;
}
const $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result$1) => {
			payload.value = result$1.value;
			if (result$1.issues.length) {
				payload.value = def.catchValue({
					...payload,
					error: { issues: result$1.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
					input: payload.value
				});
				payload.issues = [];
				payload.fallback = true;
			}
			return payload;
		});
		payload.value = result.value;
		if (result.issues.length) {
			payload.value = def.catchValue({
				...payload,
				error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
				input: payload.value
			});
			payload.issues = [];
			payload.fallback = true;
		}
		return payload;
	};
});
const $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => def.in._zod.values);
	defineLazy(inst._zod, "optin", () => def.in._zod.optin);
	defineLazy(inst._zod, "optout", () => def.out._zod.optout);
	defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") {
			const right = def.out._zod.run(payload, ctx);
			if (right instanceof Promise) return right.then((right$1) => handlePipeResult(right$1, def.in, ctx));
			return handlePipeResult(right, def.in, ctx);
		}
		const left = def.in._zod.run(payload, ctx);
		if (left instanceof Promise) return left.then((left$1) => handlePipeResult(left$1, def.out, ctx));
		return handlePipeResult(left, def.out, ctx);
	};
});
function handlePipeResult(left, next, ctx) {
	if (left.issues.length) {
		left.aborted = true;
		return left;
	}
	return next._zod.run({
		value: left.value,
		issues: left.issues,
		fallback: left.fallback
	}, ctx);
}
const $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
	defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then(handleReadonlyResult);
		return handleReadonlyResult(result);
	};
});
function handleReadonlyResult(payload) {
	payload.value = Object.freeze(payload.value);
	return payload;
}
const $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
	$ZodCheck.init(inst, def);
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _) => {
		return payload;
	};
	inst._zod.check = (payload) => {
		const input = payload.value;
		const r = def.fn(input);
		if (r instanceof Promise) return r.then((r$1) => handleRefineResult(r$1, payload, input, inst));
		handleRefineResult(r, payload, input, inst);
		return;
	};
});
function handleRefineResult(result, payload, input, inst) {
	if (!result) {
		const _iss = {
			code: "custom",
			input,
			inst,
			path: [...inst._zod.def.path ?? []],
			continue: !inst._zod.def.abort
		};
		if (inst._zod.def.params) _iss.params = inst._zod.def.params;
		payload.issues.push(issue(_iss));
	}
}

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
var _a;
const $output = Symbol("ZodOutput");
const $input = Symbol("ZodInput");
var $ZodRegistry = class {
	constructor() {
		this._map = new WeakMap();
		this._idmap = new Map();
	}
	add(schema, ..._meta) {
		const meta$2 = _meta[0];
		this._map.set(schema, meta$2);
		if (meta$2 && typeof meta$2 === "object" && "id" in meta$2) this._idmap.set(meta$2.id, schema);
		return this;
	}
	clear() {
		this._map = new WeakMap();
		this._idmap = new Map();
		return this;
	}
	remove(schema) {
		const meta$2 = this._map.get(schema);
		if (meta$2 && typeof meta$2 === "object" && "id" in meta$2) this._idmap.delete(meta$2.id);
		this._map.delete(schema);
		return this;
	}
	get(schema) {
		const p = schema._zod.parent;
		if (p) {
			const pm = { ...this.get(p) ?? {} };
			delete pm.id;
			const f = {
				...pm,
				...this._map.get(schema)
			};
			return Object.keys(f).length ? f : void 0;
		}
		return this._map.get(schema);
	}
	has(schema) {
		return this._map.has(schema);
	}
};
function registry() {
	return new $ZodRegistry();
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
const globalRegistry = globalThis.__zod_globalRegistry;

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
/* @__NO_SIDE_EFFECTS__ */
function _string(Class, params) {
	return new Class({
		type: "string",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _email(Class, params) {
	return new Class({
		type: "string",
		format: "email",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _guid(Class, params) {
	return new Class({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuid(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv4(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v4",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv6(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v6",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv7(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v7",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _url(Class, params) {
	return new Class({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _emoji(Class, params) {
	return new Class({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _nanoid(Class, params) {
	return new Class({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link _cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
/* @__NO_SIDE_EFFECTS__ */
function _cuid(Class, params) {
	return new Class({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cuid2(Class, params) {
	return new Class({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ulid(Class, params) {
	return new Class({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _xid(Class, params) {
	return new Class({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ksuid(Class, params) {
	return new Class({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ipv4(Class, params) {
	return new Class({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ipv6(Class, params) {
	return new Class({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cidrv4(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cidrv6(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _base64(Class, params) {
	return new Class({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _base64url(Class, params) {
	return new Class({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _e164(Class, params) {
	return new Class({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _jwt(Class, params) {
	return new Class({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDateTime(Class, params) {
	return new Class({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: false,
		local: false,
		precision: null,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDate(Class, params) {
	return new Class({
		type: "string",
		format: "date",
		check: "string_format",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoTime(Class, params) {
	return new Class({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDuration(Class, params) {
	return new Class({
		type: "string",
		format: "duration",
		check: "string_format",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _number(Class, params) {
	return new Class({
		type: "number",
		checks: [],
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _int(Class, params) {
	return new Class({
		type: "number",
		check: "number_format",
		abort: false,
		format: "safeint",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _boolean(Class, params) {
	return new Class({
		type: "boolean",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _undefined$1(Class, params) {
	return new Class({
		type: "undefined",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
/* @__NO_SIDE_EFFECTS__ */
function _never(Class, params) {
	return new Class({
		type: "never",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _lt(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _lte(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _gt(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _gte(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _multipleOf(value, params) {
	return new $ZodCheckMultipleOf({
		check: "multiple_of",
		...normalizeParams(params),
		value
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _maxLength(maximum, params) {
	const ch = new $ZodCheckMaxLength({
		check: "max_length",
		...normalizeParams(params),
		maximum
	});
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function _minLength(minimum, params) {
	return new $ZodCheckMinLength({
		check: "min_length",
		...normalizeParams(params),
		minimum
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _length(length, params) {
	return new $ZodCheckLengthEquals({
		check: "length_equals",
		...normalizeParams(params),
		length
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _regex(pattern, params) {
	return new $ZodCheckRegex({
		check: "string_format",
		format: "regex",
		...normalizeParams(params),
		pattern
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _lowercase(params) {
	return new $ZodCheckLowerCase({
		check: "string_format",
		format: "lowercase",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uppercase(params) {
	return new $ZodCheckUpperCase({
		check: "string_format",
		format: "uppercase",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _includes(includes, params) {
	return new $ZodCheckIncludes({
		check: "string_format",
		format: "includes",
		...normalizeParams(params),
		includes
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _startsWith(prefix, params) {
	return new $ZodCheckStartsWith({
		check: "string_format",
		format: "starts_with",
		...normalizeParams(params),
		prefix
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _endsWith(suffix, params) {
	return new $ZodCheckEndsWith({
		check: "string_format",
		format: "ends_with",
		...normalizeParams(params),
		suffix
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _overwrite(tx) {
	return new $ZodCheckOverwrite({
		check: "overwrite",
		tx
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _normalize(form) {
	return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
/* @__NO_SIDE_EFFECTS__ */
function _trim() {
	return /* @__PURE__ */ _overwrite((input) => input.trim());
}
/* @__NO_SIDE_EFFECTS__ */
function _toLowerCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
/* @__NO_SIDE_EFFECTS__ */
function _toUpperCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
/* @__NO_SIDE_EFFECTS__ */
function _slugify() {
	return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
/* @__NO_SIDE_EFFECTS__ */
function _array(Class, element, params) {
	return new Class({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _refine(Class, fn, _params) {
	const schema = new Class({
		type: "custom",
		check: "custom",
		fn,
		...normalizeParams(_params)
	});
	return schema;
}
/* @__NO_SIDE_EFFECTS__ */
function _superRefine(fn, params) {
	const ch = /* @__PURE__ */ _check((payload) => {
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, ch._zod.def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = ch);
				_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
				payload.issues.push(issue(_issue));
			}
		};
		return fn(payload.value, payload);
	}, params);
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function _check(fn, params) {
	const ch = new $ZodCheck({
		check: "custom",
		...normalizeParams(params)
	});
	ch._zod.check = fn;
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function describe$1(description) {
	const ch = new $ZodCheck({ check: "describe" });
	ch._zod.onattach = [(inst) => {
		const existing = globalRegistry.get(inst) ?? {};
		globalRegistry.add(inst, {
			...existing,
			description
		});
	}];
	ch._zod.check = () => {};
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function meta$1(metadata) {
	const ch = new $ZodCheck({ check: "meta" });
	ch._zod.onattach = [(inst) => {
		const existing = globalRegistry.get(inst) ?? {};
		globalRegistry.add(inst, {
			...existing,
			...metadata
		});
	}];
	ch._zod.check = () => {};
	return ch;
}

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
function initializeContext(params) {
	let target = params?.target ?? "draft-2020-12";
	if (target === "draft-4") target = "draft-04";
	if (target === "draft-7") target = "draft-07";
	return {
		processors: params.processors ?? {},
		metadataRegistry: params?.metadata ?? globalRegistry,
		target,
		unrepresentable: params?.unrepresentable ?? "throw",
		override: params?.override ?? (() => {}),
		io: params?.io ?? "output",
		counter: 0,
		seen: new Map(),
		cycles: params?.cycles ?? "ref",
		reused: params?.reused ?? "inline",
		external: params?.external ?? void 0
	};
}
function process(schema, ctx, _params = {
	path: [],
	schemaPath: []
}) {
	var _a$2;
	const def = schema._zod.def;
	const seen = ctx.seen.get(schema);
	if (seen) {
		seen.count++;
		const isCycle = _params.schemaPath.includes(schema);
		if (isCycle) seen.cycle = _params.path;
		return seen.schema;
	}
	const result = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: _params.path
	};
	ctx.seen.set(schema, result);
	const overrideSchema = schema._zod.toJSONSchema?.();
	if (overrideSchema) result.schema = overrideSchema;
	else {
		const params = {
			..._params,
			schemaPath: [..._params.schemaPath, schema],
			path: _params.path
		};
		if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
		else {
			const _json = result.schema;
			const processor = ctx.processors[def.type];
			if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
			processor(schema, ctx, _json, params);
		}
		const parent = schema._zod.parent;
		if (parent) {
			if (!result.ref) result.ref = parent;
			process(parent, ctx, params);
			ctx.seen.get(parent).isParent = true;
		}
	}
	const meta$2 = ctx.metadataRegistry.get(schema);
	if (meta$2) Object.assign(result.schema, meta$2);
	if (ctx.io === "input" && isTransforming(schema)) {
		delete result.schema.examples;
		delete result.schema.default;
	}
	if (ctx.io === "input" && "_prefault" in result.schema) (_a$2 = result.schema).default ?? (_a$2.default = result.schema._prefault);
	delete result.schema._prefault;
	const _result = ctx.seen.get(schema);
	return _result.schema;
}
function extractDefs(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const idToSchema = new Map();
	for (const entry of ctx.seen.entries()) {
		const id = ctx.metadataRegistry.get(entry[0])?.id;
		if (id) {
			const existing = idToSchema.get(id);
			if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			idToSchema.set(id, entry[0]);
		}
	}
	const makeURI = (entry) => {
		const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
		if (ctx.external) {
			const externalId = ctx.external.registry.get(entry[0])?.id;
			const uriGenerator = ctx.external.uri ?? ((id$1) => id$1);
			if (externalId) return { ref: uriGenerator(externalId) };
			const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
			entry[1].defId = id;
			return {
				defId: id,
				ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
			};
		}
		if (entry[1] === root) return { ref: "#" };
		const uriPrefix = `#`;
		const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
		const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
		return {
			defId,
			ref: defUriPrefix + defId
		};
	};
	const extractToDef = (entry) => {
		if (entry[1].schema.$ref) return;
		const seen = entry[1];
		const { ref, defId } = makeURI(entry);
		seen.def = { ...seen.schema };
		if (defId) seen.defId = defId;
		const schema$1 = seen.schema;
		for (const key in schema$1) delete schema$1[key];
		schema$1.$ref = ref;
	};
	if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (schema === entry[0]) {
			extractToDef(entry);
			continue;
		}
		if (ctx.external) {
			const ext = ctx.external.registry.get(entry[0])?.id;
			if (schema !== entry[0] && ext) {
				extractToDef(entry);
				continue;
			}
		}
		const id = ctx.metadataRegistry.get(entry[0])?.id;
		if (id) {
			extractToDef(entry);
			continue;
		}
		if (seen.cycle) {
			extractToDef(entry);
			continue;
		}
		if (seen.count > 1) {
			if (ctx.reused === "ref") {
				extractToDef(entry);
				continue;
			}
		}
	}
}
function finalize(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const flattenRef = (zodSchema) => {
		const seen = ctx.seen.get(zodSchema);
		if (seen.ref === null) return;
		const schema$1 = seen.def ?? seen.schema;
		const _cached = { ...schema$1 };
		const ref = seen.ref;
		seen.ref = null;
		if (ref) {
			flattenRef(ref);
			const refSeen = ctx.seen.get(ref);
			const refSchema = refSeen.schema;
			if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
				schema$1.allOf = schema$1.allOf ?? [];
				schema$1.allOf.push(refSchema);
			} else Object.assign(schema$1, refSchema);
			Object.assign(schema$1, _cached);
			const isParentRef = zodSchema._zod.parent === ref;
			if (isParentRef) for (const key in schema$1) {
				if (key === "$ref" || key === "allOf") continue;
				if (!(key in _cached)) delete schema$1[key];
			}
			if (refSchema.$ref && refSeen.def) for (const key in schema$1) {
				if (key === "$ref" || key === "allOf") continue;
				if (key in refSeen.def && JSON.stringify(schema$1[key]) === JSON.stringify(refSeen.def[key])) delete schema$1[key];
			}
		}
		const parent = zodSchema._zod.parent;
		if (parent && parent !== ref) {
			flattenRef(parent);
			const parentSeen = ctx.seen.get(parent);
			if (parentSeen?.schema.$ref) {
				schema$1.$ref = parentSeen.schema.$ref;
				if (parentSeen.def) for (const key in schema$1) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in parentSeen.def && JSON.stringify(schema$1[key]) === JSON.stringify(parentSeen.def[key])) delete schema$1[key];
				}
			}
		}
		ctx.override({
			zodSchema,
			jsonSchema: schema$1,
			path: seen.path ?? []
		});
	};
	for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
	const result = {};
	if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
	else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
	else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
	else if (ctx.target === "openapi-3.0") {}
	if (ctx.external?.uri) {
		const id = ctx.external.registry.get(schema)?.id;
		if (!id) throw new Error("Schema is missing an `id` property");
		result.$id = ctx.external.uri(id);
	}
	Object.assign(result, root.def ?? root.schema);
	const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
	if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
	const defs = ctx.external?.defs ?? {};
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.def && seen.defId) {
			if (seen.def.id === seen.defId) delete seen.def.id;
			defs[seen.defId] = seen.def;
		}
	}
	if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
	else result.definitions = defs;
	try {
		const finalized = JSON.parse(JSON.stringify(result));
		Object.defineProperty(finalized, "~standard", {
			value: {
				...schema["~standard"],
				jsonSchema: {
					input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
					output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
				}
			},
			enumerable: false,
			writable: false
		});
		return finalized;
	} catch (_err) {
		throw new Error("Error converting schema to JSON.");
	}
}
function isTransforming(_schema, _ctx) {
	const ctx = _ctx ?? { seen: new Set() };
	if (ctx.seen.has(_schema)) return false;
	ctx.seen.add(_schema);
	const def = _schema._zod.def;
	if (def.type === "transform") return true;
	if (def.type === "array") return isTransforming(def.element, ctx);
	if (def.type === "set") return isTransforming(def.valueType, ctx);
	if (def.type === "lazy") return isTransforming(def.getter(), ctx);
	if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
	if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
	if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
	if (def.type === "pipe") {
		if (_schema._zod.traits.has("$ZodCodec")) return true;
		return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
	}
	if (def.type === "object") {
		for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
		return false;
	}
	if (def.type === "union") {
		for (const option of def.options) if (isTransforming(option, ctx)) return true;
		return false;
	}
	if (def.type === "tuple") {
		for (const item of def.items) if (isTransforming(item, ctx)) return true;
		if (def.rest && isTransforming(def.rest, ctx)) return true;
		return false;
	}
	return false;
}
/**
* Creates a toJSONSchema method for a schema instance.
* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
*/
const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
	const ctx = initializeContext({
		...params,
		processors
	});
	process(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
	const { libraryOptions, target } = params ?? {};
	const ctx = initializeContext({
		...libraryOptions ?? {},
		target,
		io,
		processors
	});
	process(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-processors.js
const formatMap = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
};
const stringProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	json.type = "string";
	const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
	if (typeof minimum === "number") json.minLength = minimum;
	if (typeof maximum === "number") json.maxLength = maximum;
	if (format) {
		json.format = formatMap[format] ?? format;
		if (json.format === "") delete json.format;
		if (format === "time") delete json.format;
	}
	if (contentEncoding) json.contentEncoding = contentEncoding;
	if (patterns && patterns.size > 0) {
		const regexes = [...patterns];
		if (regexes.length === 1) json.pattern = regexes[0].source;
		else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
			...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: regex.source
		}))];
	}
};
const numberProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
	if (typeof format === "string" && format.includes("int")) json.type = "integer";
	else json.type = "number";
	const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
	const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
	const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
	if (exMin) if (legacy) {
		json.minimum = exclusiveMinimum;
		json.exclusiveMinimum = true;
	} else json.exclusiveMinimum = exclusiveMinimum;
	else if (typeof minimum === "number") json.minimum = minimum;
	if (exMax) if (legacy) {
		json.maximum = exclusiveMaximum;
		json.exclusiveMaximum = true;
	} else json.exclusiveMaximum = exclusiveMaximum;
	else if (typeof maximum === "number") json.maximum = maximum;
	if (typeof multipleOf === "number") json.multipleOf = multipleOf;
};
const booleanProcessor = (_schema, _ctx, json, _params) => {
	json.type = "boolean";
};
const undefinedProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Undefined cannot be represented in JSON Schema");
};
const neverProcessor = (_schema, _ctx, json, _params) => {
	json.not = {};
};
const unknownProcessor = (_schema, _ctx, _json, _params) => {};
const enumProcessor = (schema, _ctx, json, _params) => {
	const def = schema._zod.def;
	const values = getEnumValues(def.entries);
	if (values.every((v) => typeof v === "number")) json.type = "number";
	if (values.every((v) => typeof v === "string")) json.type = "string";
	json.enum = values;
};
const literalProcessor = (schema, ctx, json, _params) => {
	const def = schema._zod.def;
	const vals = [];
	for (const val of def.values) if (val === void 0) {
		if (ctx.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
	} else if (typeof val === "bigint") if (ctx.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
	else vals.push(Number(val));
	else vals.push(val);
	if (vals.length === 0) {} else if (vals.length === 1) {
		const val = vals[0];
		json.type = val === null ? "null" : typeof val;
		if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
		else json.const = val;
	} else {
		if (vals.every((v) => typeof v === "number")) json.type = "number";
		if (vals.every((v) => typeof v === "string")) json.type = "string";
		if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
		if (vals.every((v) => v === null)) json.type = "null";
		json.enum = vals;
	}
};
const customProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
};
const transformProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
};
const arrayProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const { minimum, maximum } = schema._zod.bag;
	if (typeof minimum === "number") json.minItems = minimum;
	if (typeof maximum === "number") json.maxItems = maximum;
	json.type = "array";
	json.items = process(def.element, ctx, {
		...params,
		path: [...params.path, "items"]
	});
};
const objectProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	json.type = "object";
	json.properties = {};
	const shape = def.shape;
	for (const key in shape) json.properties[key] = process(shape[key], ctx, {
		...params,
		path: [
			...params.path,
			"properties",
			key
		]
	});
	const allKeys = new Set(Object.keys(shape));
	const requiredKeys = new Set([...allKeys].filter((key) => {
		const v = def.shape[key]._zod;
		if (ctx.io === "input") return v.optin === void 0;
		else return v.optout === void 0;
	}));
	if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
	if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
	else if (!def.catchall) {
		if (ctx.io === "output") json.additionalProperties = false;
	} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
		...params,
		path: [...params.path, "additionalProperties"]
	});
};
const unionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const isExclusive = def.inclusive === false;
	const options = def.options.map((x, i) => process(x, ctx, {
		...params,
		path: [
			...params.path,
			isExclusive ? "oneOf" : "anyOf",
			i
		]
	}));
	if (isExclusive) json.oneOf = options;
	else json.anyOf = options;
};
const intersectionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const a = process(def.left, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			0
		]
	});
	const b = process(def.right, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			1
		]
	});
	const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
	const allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
	json.allOf = allOf;
};
const nullableProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const inner = process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	if (ctx.target === "openapi-3.0") {
		seen.ref = def.innerType;
		json.nullable = true;
	} else json.anyOf = [inner, { type: "null" }];
};
const nonoptionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
const defaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
const prefaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
const catchProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	let catchValue;
	try {
		catchValue = def.catchValue(void 0);
	} catch {
		throw new Error("Dynamic catch values are not supported in JSON Schema");
	}
	json.default = catchValue;
};
const pipeProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	const inIsTransform = def.in._zod.traits.has("$ZodTransform");
	const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
	process(innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = innerType;
};
const readonlyProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.readOnly = true;
};
const optionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/iso.js
const ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
	$ZodISODateTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function datetime(params) {
	return _isoDateTime(ZodISODateTime, params);
}
const ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
	$ZodISODate.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function date(params) {
	return _isoDate(ZodISODate, params);
}
const ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
	$ZodISOTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function time(params) {
	return _isoTime(ZodISOTime, params);
}
const ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
	$ZodISODuration.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function duration(params) {
	return _isoDuration(ZodISODuration, params);
}

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/errors.js
const initializer = (inst, issues) => {
	$ZodError.init(inst, issues);
	inst.name = "ZodError";
	Object.defineProperties(inst, {
		format: { value: (mapper) => formatError(inst, mapper) },
		flatten: { value: (mapper) => flattenError(inst, mapper) },
		addIssue: { value: (issue$1) => {
			inst.issues.push(issue$1);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		addIssues: { value: (issues$1) => {
			inst.issues.push(...issues$1);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		isEmpty: { get() {
			return inst.issues.length === 0;
		} }
	});
};
const ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer, { Parent: Error });

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/parse.js
const parse = /* @__PURE__ */ _parse(ZodRealError);
const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
const encode = /* @__PURE__ */ _encode(ZodRealError);
const decode = /* @__PURE__ */ _decode(ZodRealError);
const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
const _installedGroups = /* @__PURE__ */ new WeakMap();
function _installLazyMethods(inst, group, methods) {
	const proto = Object.getPrototypeOf(inst);
	let installed = _installedGroups.get(proto);
	if (!installed) {
		installed = new Set();
		_installedGroups.set(proto, installed);
	}
	if (installed.has(group)) return;
	installed.add(group);
	for (const key in methods) {
		const fn = methods[key];
		Object.defineProperty(proto, key, {
			configurable: true,
			enumerable: false,
			get() {
				const bound = fn.bind(this);
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					enumerable: true,
					value: bound
				});
				return bound;
			},
			set(v) {
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					enumerable: true,
					value: v
				});
			}
		});
	}
}
const ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
	$ZodType.init(inst, def);
	Object.assign(inst["~standard"], { jsonSchema: {
		input: createStandardJSONSchemaMethod(inst, "input"),
		output: createStandardJSONSchemaMethod(inst, "output")
	} });
	inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
	inst.def = def;
	inst.type = def.type;
	Object.defineProperty(inst, "_def", { value: def });
	inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
	inst.safeParse = (data, params) => safeParse(inst, data, params);
	inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
	inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
	inst.spa = inst.safeParseAsync;
	inst.encode = (data, params) => encode(inst, data, params);
	inst.decode = (data, params) => decode(inst, data, params);
	inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
	inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
	inst.safeEncode = (data, params) => safeEncode(inst, data, params);
	inst.safeDecode = (data, params) => safeDecode(inst, data, params);
	inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
	inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
	_installLazyMethods(inst, "ZodType", {
		check(...chks) {
			const def$1 = this.def;
			return this.clone(mergeDefs(def$1, { checks: [...def$1.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
				check: ch,
				def: { check: "custom" },
				onattach: []
			} } : ch)] }), { parent: true });
		},
		with(...chks) {
			return this.check(...chks);
		},
		clone(def$1, params) {
			return clone(this, def$1, params);
		},
		brand() {
			return this;
		},
		register(reg, meta$2) {
			reg.add(this, meta$2);
			return this;
		},
		refine(check, params) {
			return this.check(refine(check, params));
		},
		superRefine(refinement, params) {
			return this.check(superRefine(refinement, params));
		},
		overwrite(fn) {
			return this.check(_overwrite(fn));
		},
		optional() {
			return optional(this);
		},
		exactOptional() {
			return exactOptional(this);
		},
		nullable() {
			return nullable(this);
		},
		nullish() {
			return optional(nullable(this));
		},
		nonoptional(params) {
			return nonoptional(this, params);
		},
		array() {
			return array(this);
		},
		or(arg) {
			return union([this, arg]);
		},
		and(arg) {
			return intersection(this, arg);
		},
		transform(tx) {
			return pipe(this, transform(tx));
		},
		default(d) {
			return _default(this, d);
		},
		prefault(d) {
			return prefault(this, d);
		},
		catch(params) {
			return _catch(this, params);
		},
		pipe(target) {
			return pipe(this, target);
		},
		readonly() {
			return readonly(this);
		},
		describe(description) {
			const cl = this.clone();
			globalRegistry.add(cl, { description });
			return cl;
		},
		meta(...args) {
			if (args.length === 0) return globalRegistry.get(this);
			const cl = this.clone();
			globalRegistry.add(cl, args[0]);
			return cl;
		},
		isOptional() {
			return this.safeParse(void 0).success;
		},
		isNullable() {
			return this.safeParse(null).success;
		},
		apply(fn) {
			return fn(this);
		}
	});
	Object.defineProperty(inst, "description", {
		get() {
			return globalRegistry.get(inst)?.description;
		},
		configurable: true
	});
	return inst;
});
/** @internal */
const _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
	const bag = inst._zod.bag;
	inst.format = bag.format ?? null;
	inst.minLength = bag.minimum ?? null;
	inst.maxLength = bag.maximum ?? null;
	_installLazyMethods(inst, "_ZodString", {
		regex(...args) {
			return this.check(_regex(...args));
		},
		includes(...args) {
			return this.check(_includes(...args));
		},
		startsWith(...args) {
			return this.check(_startsWith(...args));
		},
		endsWith(...args) {
			return this.check(_endsWith(...args));
		},
		min(...args) {
			return this.check(_minLength(...args));
		},
		max(...args) {
			return this.check(_maxLength(...args));
		},
		length(...args) {
			return this.check(_length(...args));
		},
		nonempty(...args) {
			return this.check(_minLength(1, ...args));
		},
		lowercase(params) {
			return this.check(_lowercase(params));
		},
		uppercase(params) {
			return this.check(_uppercase(params));
		},
		trim() {
			return this.check(_trim());
		},
		normalize(...args) {
			return this.check(_normalize(...args));
		},
		toLowerCase() {
			return this.check(_toLowerCase());
		},
		toUpperCase() {
			return this.check(_toUpperCase());
		},
		slugify() {
			return this.check(_slugify());
		}
	});
});
const ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	_ZodString.init(inst, def);
	inst.email = (params) => inst.check(_email(ZodEmail, params));
	inst.url = (params) => inst.check(_url(ZodURL, params));
	inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
	inst.emoji = (params) => inst.check(_emoji(ZodEmoji, params));
	inst.guid = (params) => inst.check(_guid(ZodGUID, params));
	inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
	inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
	inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
	inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
	inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
	inst.guid = (params) => inst.check(_guid(ZodGUID, params));
	inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
	inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
	inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
	inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
	inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
	inst.xid = (params) => inst.check(_xid(ZodXID, params));
	inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
	inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
	inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
	inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
	inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
	inst.e164 = (params) => inst.check(_e164(ZodE164, params));
	inst.datetime = (params) => inst.check(datetime(params));
	inst.date = (params) => inst.check(date(params));
	inst.time = (params) => inst.check(time(params));
	inst.duration = (params) => inst.check(duration(params));
});
function string(params) {
	return _string(ZodString, params);
}
const ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	_ZodString.init(inst, def);
});
const ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
	$ZodEmail.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
	$ZodGUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
	$ZodUUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
	$ZodURL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
	$ZodEmoji.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
	$ZodNanoID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
	$ZodCUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
	$ZodCUID2.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
	$ZodULID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
	$ZodXID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
	$ZodKSUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
	$ZodIPv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
	$ZodIPv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
	$ZodCIDRv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
	$ZodCIDRv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
	$ZodBase64.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
	$ZodBase64URL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
	$ZodE164.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
	$ZodJWT.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
	$ZodNumber.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
	_installLazyMethods(inst, "ZodNumber", {
		gt(value, params) {
			return this.check(_gt(value, params));
		},
		gte(value, params) {
			return this.check(_gte(value, params));
		},
		min(value, params) {
			return this.check(_gte(value, params));
		},
		lt(value, params) {
			return this.check(_lt(value, params));
		},
		lte(value, params) {
			return this.check(_lte(value, params));
		},
		max(value, params) {
			return this.check(_lte(value, params));
		},
		int(params) {
			return this.check(int(params));
		},
		safe(params) {
			return this.check(int(params));
		},
		positive(params) {
			return this.check(_gt(0, params));
		},
		nonnegative(params) {
			return this.check(_gte(0, params));
		},
		negative(params) {
			return this.check(_lt(0, params));
		},
		nonpositive(params) {
			return this.check(_lte(0, params));
		},
		multipleOf(value, params) {
			return this.check(_multipleOf(value, params));
		},
		step(value, params) {
			return this.check(_multipleOf(value, params));
		},
		finite() {
			return this;
		}
	});
	const bag = inst._zod.bag;
	inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
	inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
	inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
	inst.isFinite = true;
	inst.format = bag.format ?? null;
});
function number(params) {
	return _number(ZodNumber, params);
}
const ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
	$ZodNumberFormat.init(inst, def);
	ZodNumber.init(inst, def);
});
function int(params) {
	return _int(ZodNumberFormat, params);
}
const ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
	$ZodBoolean.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean(params) {
	return _boolean(ZodBoolean, params);
}
const ZodUndefined = /* @__PURE__ */ $constructor("ZodUndefined", (inst, def) => {
	$ZodUndefined.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => undefinedProcessor(inst, ctx, json, params);
});
function _undefined(params) {
	return _undefined$1(ZodUndefined, params);
}
const ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
	$ZodUnknown.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
});
function unknown() {
	return _unknown(ZodUnknown);
}
const ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
	$ZodNever.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
	return _never(ZodNever, params);
}
const ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
	$ZodArray.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
	inst.element = def.element;
	_installLazyMethods(inst, "ZodArray", {
		min(n, params) {
			return this.check(_minLength(n, params));
		},
		nonempty(params) {
			return this.check(_minLength(1, params));
		},
		max(n, params) {
			return this.check(_maxLength(n, params));
		},
		length(n, params) {
			return this.check(_length(n, params));
		},
		unwrap() {
			return this.element;
		}
	});
});
function array(element, params) {
	return _array(ZodArray, element, params);
}
const ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
	$ZodObjectJIT.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
	defineLazy(inst, "shape", () => {
		return def.shape;
	});
	_installLazyMethods(inst, "ZodObject", {
		keyof() {
			return _enum(Object.keys(this._zod.def.shape));
		},
		catchall(catchall) {
			return this.clone({
				...this._zod.def,
				catchall
			});
		},
		passthrough() {
			return this.clone({
				...this._zod.def,
				catchall: unknown()
			});
		},
		loose() {
			return this.clone({
				...this._zod.def,
				catchall: unknown()
			});
		},
		strict() {
			return this.clone({
				...this._zod.def,
				catchall: never()
			});
		},
		strip() {
			return this.clone({
				...this._zod.def,
				catchall: void 0
			});
		},
		extend(incoming) {
			return extend(this, incoming);
		},
		safeExtend(incoming) {
			return safeExtend(this, incoming);
		},
		merge(other) {
			return merge(this, other);
		},
		pick(mask) {
			return pick(this, mask);
		},
		omit(mask) {
			return omit(this, mask);
		},
		partial(...args) {
			return partial(ZodOptional, this, args[0]);
		},
		required(...args) {
			return required(ZodNonOptional, this, args[0]);
		}
	});
});
function object(shape, params) {
	const def = {
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	};
	return new ZodObject(def);
}
const ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
	$ZodUnion.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
	inst.options = def.options;
});
function union(options, params) {
	return new ZodUnion({
		type: "union",
		options,
		...normalizeParams(params)
	});
}
const ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
	$ZodIntersection.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
	return new ZodIntersection({
		type: "intersection",
		left,
		right
	});
}
const ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
	$ZodEnum.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
	inst.enum = def.entries;
	inst.options = Object.values(def.entries);
	const keys = new Set(Object.keys(def.entries));
	inst.extract = (values, params) => {
		const newEntries = {};
		for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
	inst.exclude = (values, params) => {
		const newEntries = { ...def.entries };
		for (const value of values) if (keys.has(value)) delete newEntries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
});
function _enum(values, params) {
	const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
	return new ZodEnum({
		type: "enum",
		entries,
		...normalizeParams(params)
	});
}
const ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
	$ZodLiteral.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
	inst.values = new Set(def.values);
	Object.defineProperty(inst, "value", { get() {
		if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return def.values[0];
	} });
});
function literal(value, params) {
	return new ZodLiteral({
		type: "literal",
		values: Array.isArray(value) ? value : [value],
		...normalizeParams(params)
	});
}
const ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
	$ZodTransform.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
	inst._zod.parse = (payload, _ctx) => {
		if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = inst);
				payload.issues.push(issue(_issue));
			}
		};
		const output = def.transform(payload.value, payload);
		if (output instanceof Promise) return output.then((output$1) => {
			payload.value = output$1;
			payload.fallback = true;
			return payload;
		});
		payload.value = output;
		payload.fallback = true;
		return payload;
	};
});
function transform(fn) {
	return new ZodTransform({
		type: "transform",
		transform: fn
	});
}
const ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
	return new ZodOptional({
		type: "optional",
		innerType
	});
}
const ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
	$ZodExactOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
	return new ZodExactOptional({
		type: "optional",
		innerType
	});
}
const ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
	$ZodNullable.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
	return new ZodNullable({
		type: "nullable",
		innerType
	});
}
const ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
	$ZodDefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
	return new ZodDefault({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
	$ZodPrefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
	return new ZodPrefault({
		type: "prefault",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
	$ZodNonOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
	return new ZodNonOptional({
		type: "nonoptional",
		innerType,
		...normalizeParams(params)
	});
}
const ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
	$ZodCatch.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
	return new ZodCatch({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
	});
}
const ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
	$ZodPipe.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
	inst.in = def.in;
	inst.out = def.out;
});
function pipe(in_, out) {
	return new ZodPipe({
		type: "pipe",
		in: in_,
		out
	});
}
const ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
	$ZodReadonly.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
	return new ZodReadonly({
		type: "readonly",
		innerType
	});
}
const ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
	$ZodCustom.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
	return _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
	return _superRefine(fn, params);
}
const describe = describe$1;
const meta = meta$1;

//#endregion
//#region src/remote-contribution.ts
const _dsh_yuyi_yuyi_inbox_parameter_0$schema = union([intersection(string(), unknown()), literal("device")]);
const _dsh_yuyi_yuyi_inbox_parameter_1$schema = union([
	_undefined(),
	literal(false),
	literal(true)
]);
const _dsh_yuyi_yuyi_inbox_result$schema = array(object({
	"message": object({
		"id": string(),
		"mode": union([literal("notify"), literal("mail")]),
		"text": string(),
		"from": object({
			"device": string(),
			"sessionID": string(),
			"name": string().optional(),
			"agentId": string().optional(),
			"ownerUsername": string().optional(),
			"role": string().optional()
		}),
		"to": object({
			"owner": string().optional(),
			"device": string().optional(),
			"target": string()
		}),
		"time": number(),
		"replyTo": string().optional(),
		"expectReply": boolean().optional(),
		"taskId": string().optional(),
		"traceId": string().optional(),
		"hopCount": number().optional(),
		"classification": string().optional(),
		"contextHint": string().optional(),
		"policyBypass": boolean().optional(),
		"contentSignature": string().optional(),
		"signatureKeyId": string().optional()
	}),
	"receivedAt": number()
}));
const _dsh_yuyi_yuyi_peers_result$schema = array(object({
	"device": string(),
	"instanceID": string(),
	"sessions": array(object({
		"sessionID": string(),
		"title": string(),
		"directory": string(),
		"name": string().optional(),
		"capabilities": object({
			"sandbox": union([
				literal("full"),
				literal("restricted"),
				literal("none")
			]).optional(),
			"network": boolean().optional(),
			"wake": boolean().optional()
		}).optional()
	})),
	"agentId": string().optional(),
	"role": string().optional(),
	"lastActiveAt": number().optional()
}));
const _dsh_yuyi_yuyi_collab_result$schema = object({
	"peers": _dsh_yuyi_yuyi_peers_result$schema.readonly(),
	"tasks": array(object({
		"taskId": string(),
		"createdAt": number(),
		"owner": object({
			"agentId": string().optional(),
			"name": string().optional(),
			"device": string().optional(),
			"sessionID": string().optional()
		}).optional(),
		"round": number(),
		"lastRequestText": string(),
		"lastRequestAt": number().optional(),
		"lastReplyMsgId": string().optional(),
		"lastReplyFrom": object({
			"device": string().optional(),
			"name": string().optional(),
			"sessionID": string().optional(),
			"agentId": string().optional(),
			"ownerUsername": string().optional()
		}).optional(),
		"pendingTarget": string().optional(),
		"artifacts": array(object({
			"ref": string(),
			"note": string().optional()
		})),
		"summaries": array(object({
			"by": string(),
			"text": string()
		})),
		"latestAttachSession": string().optional(),
		"closed": boolean().optional(),
		"archived": boolean().optional(),
		"goal": object({
			"description": string(),
			"criteria": array(string())
		}).optional(),
		"verification": array(object({
			"criterionIndex": number(),
			"passed": boolean(),
			"evidence": string().optional(),
			"verifier": string().optional()
		})).optional(),
		"acceptanceComplete": boolean(),
		"phase": object({
			"name": string(),
			"note": string().optional()
		}).optional(),
		"assignee": object({
			"target": string(),
			"phase": string().optional(),
			"note": string().optional()
		}).optional(),
		"dependsOn": array(object({
			"taskId": string(),
			"note": string().optional()
		})),
		"incomplete": boolean()
	})).readonly(),
	"generatedAt": number().readonly()
});
const _dsh_yuyi_yuyi_status_result$schema = object({
	"configured": boolean().readonly(),
	"connected": boolean().readonly(),
	"hub": string().readonly(),
	"device": string().readonly(),
	"agentId": string().readonly().optional(),
	"agentName": string().readonly().optional(),
	"ownerUsername": string().readonly().optional(),
	"role": string().readonly().optional(),
	"lastError": string().readonly().optional(),
	"hubUnread": number().readonly().optional(),
	"deviceUnread": number().readonly(),
	"sessions": array(object({
		"sessionId": intersection(string(), unknown()).readonly(),
		"title": string().readonly(),
		"directory": string().readonly(),
		"name": string().readonly().optional()
	})).readonly()
});
const TYPERT_REMOTE = {
	package: "dsh-yuyi",
	descriptors: [
		{
			id: "dsh-yuyi#yuyi/inbox",
			service: "yuyi",
			namespace: "yuyi",
			method: "inbox",
			implementation: "inboxRead",
			invocation: { kind: "direct" },
			parameters: [{
				name: "target",
				wire: "target",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-yuyi#yuyi/inbox:target",
					schema: _dsh_yuyi_yuyi_inbox_parameter_0$schema
				}
			}, {
				name: "peek",
				wire: "peek",
				source: "json",
				acceptsUndefined: true,
				codec: {
					mode: "strict",
					typeSymbol: "dsh-yuyi#yuyi/inbox:peek",
					schema: _dsh_yuyi_yuyi_inbox_parameter_1$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-yuyi#yuyi/inbox:result",
				schema: _dsh_yuyi_yuyi_inbox_result$schema
			},
			sourceLocation: {
				"file": "packages/yuyi/yuyi/src/index.ts",
				"line": 288,
				"column": 3
			}
		},
		{
			id: "dsh-yuyi#yuyi/peers",
			service: "yuyi",
			namespace: "yuyi",
			method: "peers",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "dsh-yuyi#yuyi/peers:result",
				schema: _dsh_yuyi_yuyi_peers_result$schema
			},
			sourceLocation: {
				"file": "packages/yuyi/yuyi/src/index.ts",
				"line": 298,
				"column": 9
			}
		},
		{
			id: "dsh-yuyi#yuyi/status",
			service: "yuyi",
			namespace: "yuyi",
			method: "status",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "dsh-yuyi/types#YuyiStatus",
				schema: _dsh_yuyi_yuyi_status_result$schema
			},
			sourceLocation: {
				"file": "packages/yuyi/yuyi/src/index.ts",
				"line": 144,
				"column": 3
			}
		},
		{
			id: "dsh-yuyi#yuyi/collab",
			service: "yuyi",
			namespace: "yuyi",
			method: "collab",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "dsh-yuyi/types#YuyiCollabSnapshot",
				schema: _dsh_yuyi_yuyi_collab_result$schema
			},
			sourceLocation: {
				"file": "src/service.ts",
				"line": 345,
				"column": 9
			}
		}
	]
};
var remote_contribution_default = TYPERT_REMOTE;

//#endregion
//#region src/client/status-mirror.ts
/**

* 解包一个 Remote 结果，抛出视图要呈现的失败文案。

* @param result - Remote 调用的结果信封。

* @returns 成功载荷。

*/
function unwrap(result) {
	if (!result.ok) throw new Error(result.error.message ?? "yuyi remote call failed");
	return result.value;
}
const DEFAULT_POLL_MS$1 = 1e4;
/**

* 把宿主连接状态镜像进一个可订阅 store。

*/
var YuyiStatusMirror = class {
	state = { current: void 0 };
	listeners = new Set();
	timer;
	/**
	
	* @param readStatus - 一次 Remote 状态读取（由调用方解包）。
	
	*/
	constructor(readStatus) {
		this.readStatus = readStatus;
	}
	getSnapshot() {
		return this.state;
	}
	/**
	
	* 观察快照替换。
	
	* @param listener - 每次变化后调用。
	
	* @returns 移除该监听器的清理函数。
	
	*/
	subscribe(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	/**
	
	* 播种 store 并在页面可见时轮询。
	
	* @param pollMs - 刷新间隔；默认 10 秒。
	
	* @returns 停止轮询的清理函数。
	
	*/
	start(pollMs = DEFAULT_POLL_MS$1) {
		this.refresh();
		this.timer = setInterval(() => {
			const hidden = typeof document !== "undefined" && document.visibilityState === "hidden";
			if (!hidden) this.refresh();
		}, pollMs);
		return () => {
			if (this.timer !== void 0) clearInterval(this.timer);
			this.timer = void 0;
		};
	}
	refresh() {
		this.readStatus().then((status) => {
			this.publish(status);
		}, () => {});
	}
	publish(status) {
		if (this.state.current === status) return;
		this.state = { current: status };
		for (const listener of [...this.listeners]) listener();
	}
};

//#endregion
//#region src/client/collab-mirror.ts
/**

* 解包一个 Remote 结果，抛出视图要呈现的失败文案。

* @param result - Remote 调用的结果信封。

* @returns 成功载荷。

*/
function unwrapCollab(result) {
	if (!result.ok) throw new Error(result.error.message ?? "yuyi remote call failed");
	return result.value;
}
const DEFAULT_POLL_MS = 1e4;
/**

* 把协同快照镜像进一个可订阅 store。

*/
var YuyiCollabMirror = class {
	state = { current: void 0 };
	listeners = new Set();
	timer;
	/**
	
	* @param readCollab - 一次 Remote collab 读取（由调用方解包）。
	
	*/
	constructor(readCollab) {
		this.readCollab = readCollab;
	}
	getSnapshot() {
		return this.state;
	}
	/**
	
	* 观察快照替换。
	
	* @param listener - 每次变化后调用。
	
	* @returns 移除该监听器的清理函数。
	
	*/
	subscribe(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	/**
	
	* 播种 store 并在页面可见时轮询。
	
	* @param pollMs - 刷新间隔；默认 10 秒。
	
	* @returns 停止轮询的清理函数。
	
	*/
	start(pollMs = DEFAULT_POLL_MS) {
		this.refresh();
		this.timer = setInterval(() => {
			const hidden = typeof document !== "undefined" && document.visibilityState === "hidden";
			if (!hidden) this.refresh();
		}, pollMs);
		return () => {
			if (this.timer !== void 0) clearInterval(this.timer);
			this.timer = void 0;
		};
	}
	refresh() {
		this.readCollab().then((snapshot) => {
			this.publish(snapshot);
		}, () => {});
	}
	publish(snapshot) {
		if (this.state.current === snapshot) return;
		this.state = { current: snapshot };
		for (const listener of [...this.listeners]) listener();
	}
};

//#endregion
//#region src/client/panel/locales.ts
const NS = "yuyiPanel";
const zh = {
	"panel.title": "御驿协同",
	"state.connected": "已连接",
	"state.disconnected": "已断开",
	"state.unconfigured": "未配置",
	"overview.members": "成员",
	"overview.done": "已完成",
	"overview.pending": "未决",
	"legend.inProgress": "进行中",
	"legend.awaiting": "等待回信",
	"legend.deliverable": "待验收",
	"legend.done": "已完成",
	"role.avatar": "主理",
	"role.worker": "worker",
	"role.coder": "coder",
	"presence.active": "活跃",
	"presence.awaiting": "等待回信",
	"presence.idle": "空闲",
	"presence.unknown": "未知",
	"member.running": "执行中 {count}",
	"member.waiting": "等它回信 {count}",
	"roster.title": "成员",
	"roster.empty": "尚无其他成员，注册会话或连接 peer 后出现",
	"tasks.title": "任务链",
	"tasks.empty": "本机暂无任务链记录",
	"task.round": "{round} 轮",
	"task.pendingTo": "等待 {target} 回信",
	"task.phase": "阶段",
	"task.assignee": "归属",
	"task.acceptance": "验收 {passed}/{total}",
	"task.acceptanceDone": "验收通过，可关闭",
	"task.goalEmpty": "未设验收目标",
	"task.depends": "依赖",
	"task.artifacts": "产物",
	"task.closed": "已关闭",
	"task.archived": "已归档",
	"graph.title": "任务依赖",
	"graph.hint": "悬停高亮上游链，点击选中",
	"graph.cycle": "{count} 条环边被忽略",
	"messages.title": "停靠消息",
	"messages.empty": "收件箱为空",
	"error.title": "读取失败",
	"toggle.open": "协同面板",
	"card.openPanel": "活动面板",
	"card.send": "御驿发送",
	"card.delivered.notify": "实时唤醒",
	"card.delivered.mail_fallback": "降级入箱",
	"card.reply": "回信",
	"card.peers": "可达成员"
};
const en = {
	"panel.title": "Yuyi Collab",
	"state.connected": "connected",
	"state.disconnected": "disconnected",
	"state.unconfigured": "not configured",
	"overview.members": "members",
	"overview.done": "done",
	"overview.pending": "pending",
	"legend.inProgress": "in progress",
	"legend.awaiting": "awaiting reply",
	"legend.deliverable": "in review",
	"legend.done": "done",
	"role.avatar": "lead",
	"role.worker": "worker",
	"role.coder": "coder",
	"presence.active": "active",
	"presence.awaiting": "awaiting",
	"presence.idle": "idle",
	"presence.unknown": "unknown",
	"member.running": "running {count}",
	"member.waiting": "waiting on {count}",
	"roster.title": "Members",
	"roster.empty": "no other members yet; register a session or reach a peer",
	"tasks.title": "Task chains",
	"tasks.empty": "no local task records yet",
	"task.round": "{round} rounds",
	"task.pendingTo": "awaiting reply from {target}",
	"task.phase": "phase",
	"task.assignee": "assignee",
	"task.acceptance": "acceptance {passed}/{total}",
	"task.acceptanceDone": "acceptance complete, ready to close",
	"task.goalEmpty": "no acceptance goal set",
	"task.depends": "depends on",
	"task.artifacts": "artifacts",
	"task.closed": "closed",
	"task.archived": "archived",
	"graph.title": "Dependencies",
	"graph.hint": "hover to highlight the upstream chain, click to select",
	"graph.cycle": "{count} cycle edges ignored",
	"messages.title": "Parked messages",
	"messages.empty": "inbox is empty",
	"error.title": "read failed",
	"toggle.open": "collab panel",
	"card.openPanel": "activity panel",
	"card.send": "Yuyi send",
	"card.delivered.notify": "delivered live",
	"card.delivered.mail_fallback": "parked in inbox",
	"card.reply": "reply",
	"card.peers": "reachable members"
};

//#endregion
//#region src/client/panel/model.ts
/**

* 一个收件箱发送者渲染出的标签。

* @param from - 一条收件箱消息的背书发送者字段。

* @returns 显示标签。

*/
function inboxSender(from) {
	const identity = from.name ?? from.sessionID;
	return from.device.length > 0 ? `${identity}@${from.device}` : identity;
}
/**

* 把一次 Remote 收件箱读取映射为面板的行。

* @param entries - 原始收件箱条目。

* @returns 显示行。

*/
function inboxRows(entries) {
	return entries.map((entry) => ({
		id: entry.message.id,
		from: inboxSender(entry.message.from),
		text: entry.message.text
	}));
}
/**

* 极小占位替换：{name} → params.name。宿主 t 不保证支持参数，

* 面板与卡片统一先取模板再本地替换。

* @param template - 含占位符的模板。

* @param params - 占位符值。

* @returns 渲染文本。

*/
function interpolate(template, params) {
	return template.replace(/\{(\w+)\}/g, (raw, name) => name in params ? String(params[name]) : raw);
}
function rosterNames(status) {
	return status.sessions.map((session) => (session.name ?? session.sessionId).toLowerCase());
}
const ACTIVE_WINDOW_MS = 2 * 6e4;
/**

* 把一次状态读取折叠成连接三态（旧标签页模型的原位承接）。

* @param status - 状态派生所依据的字段。

* @returns 连接状态。

*/
function connectionState(status) {
	if (status.connected) return "connected";
	return status.configured ? "disconnected" : "unconfigured";
}
/**

* 一个任务链的面板状态。

* @param task - 本机任务链视图。

* @returns 折叠后的状态。

*/
function taskStatusOf(task) {
	if (task.archived === true) return "archived";
	if (task.closed === true) return "done";
	if (task.acceptanceComplete) return "deliverable";
	if (task.pendingTarget !== void 0) return "awaiting";
	return "in_progress";
}
function targetMatches(target, member) {
	const t = target.trim().toLowerCase();
	if (t.length === 0) return false;
	const name = member.name.toLowerCase();
	const device = member.device.toLowerCase();
	return t === name || t.endsWith(`:${name}`) || t === `${name}@${device}` || device.length > 0 && t === `${device}:${name}`;
}
function activityOf(member) {
	if (member.lastActiveAt !== void 0) return member.now - member.lastActiveAt <= ACTIVE_WINDOW_MS ? "active" : "idle";
	return member.presenceBase;
}
/**

* 把 status 与 collab 快照投影为面板模型。

* @param status - 最新状态读取。

* @param collab - 最新协同快照（可能 undefined——首次读取前）。

* @param now - 活跃度判定的当前时刻（测试可注入）。

* @returns 面板模型。

*/
function panelModel(status, collab, now = Date.now()) {
	const tasks = collab?.tasks ?? [];
	const statusOf = new Map(tasks.map((task) => [task.taskId, taskStatusOf(task)]));
	const runningOrOpen = (task) => statusOf.get(task.taskId) !== "done" && statusOf.get(task.taskId) !== "archived";
	const countsFor = (member) => {
		let running = 0;
		let waiting = 0;
		for (const task of tasks) {
			if (task.assignee !== void 0 && targetMatches(task.assignee.target, member) && runningOrOpen(task)) running += 1;
			if (task.pendingTarget !== void 0 && targetMatches(task.pendingTarget, member)) waiting += 1;
		}
		return {
			running,
			waiting
		};
	};
	const presenceFor = (base, lastActiveAt, member) => {
		const presence = activityOf({
			presenceBase: base,
			lastActiveAt,
			now
		});
		if (presence !== "active") {
			for (const task of tasks) if (task.pendingTarget !== void 0 && targetMatches(task.pendingTarget, member)) return "awaiting";
		}
		return presence;
	};
	const self = {
		key: "self",
		name: status.agentName ?? status.device,
		title: status.ownerUsername ?? status.device,
		...status.role !== void 0 ? { role: status.role } : {},
		device: status.device,
		local: true,
		self: true,
		windows: status.sessions.length,
		presence: status.connected ? "active" : "unknown",
		...countsFor({
			name: status.agentName ?? status.device,
			device: status.device
		})
	};
	const peerCards = (collab?.peers ?? []).flatMap((device) => device.sessions.map((session) => {
		const member = {
			name: session.name ?? session.sessionID,
			device: device.device
		};
		return {
			key: `peer:${device.device}/${session.sessionID}`,
			name: member.name,
			title: session.title,
			...device.role !== void 0 ? { role: device.role } : {},
			device: device.device,
			local: false,
			self: false,
			presence: presenceFor("idle", device.lastActiveAt, member),
			...countsFor(member)
		};
	}));
	const seen = new Set([self.name.toLowerCase(), ...rosterNames(status)]);
	const uniquePeers = peerCards.filter((card) => {
		const id = `${card.name.toLowerCase()}@${card.device.toLowerCase()}`;
		if (seen.has(card.name.toLowerCase())) return false;
		seen.add(id);
		return true;
	});
	const all = [self, ...uniquePeers];
	const avatar = all.find((card) => card.role === "avatar");
	const members = avatar !== void 0 ? all.filter((card) => card !== avatar) : all;
	const counts = {
		members: all.length,
		inProgress: 0,
		awaiting: 0,
		deliverable: 0,
		done: 0
	};
	for (const task of tasks) {
		const card = taskStatusOf(task);
		if (card === "in_progress") counts.inProgress += 1;
		else if (card === "awaiting") counts.awaiting += 1;
		else if (card === "deliverable") counts.deliverable += 1;
		else if (card === "done") counts.done += 1;
	}
	return {
		state: connectionState(status),
		device: status.device,
		...status.agentName !== void 0 ? { agentName: status.agentName } : {},
		...status.ownerUsername !== void 0 ? { ownerUsername: status.ownerUsername } : {},
		...avatar !== void 0 ? { avatar } : {},
		members,
		counts,
		tasks
	};
}
/**

* 依赖图布局：任务为节点、dependsOn 为边。列号 = 上游最长路径，

* 依赖环上的回边忽略（计入 cycleEdges），幽灵上游（本机无记录）

* 只作端点渲染。

* @param tasks - 本机任务链视图（面板已按最近活动排序）。

* @returns 分列布局；无依赖时 edges 为空。

*/
function dagLayout(tasks) {
	const depsOf = new Map();
	const known = new Set();
	const edges = [];
	for (const task of tasks) known.add(task.taskId);
	for (const task of tasks) {
		const deps = [];
		for (const dep of task.dependsOn) {
			if (dep.taskId === task.taskId) continue;
			deps.push(dep.taskId);
			edges.push({
				from: dep.taskId,
				to: task.taskId
			});
			if (!known.has(dep.taskId)) known.add(dep.taskId);
		}
		depsOf.set(task.taskId, deps);
	}
	if (edges.length === 0) return {
		columns: [],
		edges,
		cycleEdges: 0
	};
	const columnOf = new Map();
	const visiting = new Set();
	let cycleEdges = 0;
	const measure = (id) => {
		const settled = columnOf.get(id);
		if (settled !== void 0) return settled;
		if (visiting.has(id)) {
			cycleEdges += 1;
			return -1;
		}
		visiting.add(id);
		const deps = depsOf.get(id) ?? [];
		let base = -1;
		for (const dep of deps) base = Math.max(base, measure(dep));
		visiting.delete(id);
		const column = base + 1;
		columnOf.set(id, column);
		return column;
	};
	for (const id of known) measure(id);
	const byId = new Map(tasks.map((task) => [task.taskId, task]));
	const maxColumn = Math.max(...columnOf.values(), 0);
	const columns = Array.from({ length: maxColumn + 1 }, () => []);
	const pushed = new Set();
	const push = (node, column) => {
		if (pushed.has(node.taskId)) return;
		pushed.add(node.taskId);
		(columns[Math.min(Math.max(column, 0), maxColumn)] ?? columns[0]).push(node);
	};
	for (const task of tasks) push({
		taskId: task.taskId,
		ghost: false
	}, columnOf.get(task.taskId) ?? 0);
	for (const id of known) {
		if (byId.has(id)) continue;
		push({
			taskId: id,
			ghost: true
		}, columnOf.get(id) ?? 0);
	}
	return {
		columns,
		edges,
		cycleEdges
	};
}
/**

* 从选中节点出发的全部上游传递闭包（DAG 悬停高亮路径）。

* @param layout - dagLayout 的产物。

* @param taskId - 悬停/选中的下游节点。

* @returns 该节点依赖的全部上游 id（含间接），不含自身。

*/
function upstreamOf(layout, taskId) {
	const byTo = new Map();
	for (const edge of layout.edges) {
		const list = byTo.get(edge.to) ?? [];
		list.push(edge.from);
		byTo.set(edge.to, list);
	}
	const seen = new Set();
	const walk = (id) => {
		for (const from of byTo.get(id) ?? []) {
			if (seen.has(from)) continue;
			seen.add(from);
			walk(from);
		}
	};
	walk(taskId);
	return seen;
}

//#endregion
//#region \0dsh-yuyi-css:E:\code\nodejs\dsh\dsh-yuyi\src\client\panel\YuyiPanel.module.css.mjs
const css$1 = "/* 御驿协同活动面板：shell._959fa70f95_overlay 浮层里的右缘停靠卡。\r\n   颜色/间距/圆角全走产品语义令牌（--dsw-alias-*）；宿主\r\n   overlayLayer 已对直接子节点恢复 pointer-events:auto，\r\n   面板只需管好自己的定位与层高。 */\r\n\r\n._aad0c9e117_panel {\r\n  position: absolute;\r\n  /* 顶端让开标题栏+视图标签行，底端让开输入区/发送区——\r\n     不与窗口控制按钮和 composer 争位。 */\r\n  top: 80px;\r\n  right: 12px;\r\n  bottom: 140px;\r\n  width: 340px;\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 12px;\r\n  padding: 14px 14px 18px;\r\n  overflow-y: auto;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  border-radius: 14px;\r\n  background: var(--dsw-alias-bg-base);\r\n  box-shadow: 0 8px 28px rgb(0 0 0 / 22%);\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n/* ── 头部（标题 + 连接态 + 关闭） ─────────────────────── */\r\n\r\n._e081c7e57e_head {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n  flex: none;\r\n}\r\n\r\n._b5ccd1ca3e_headTitle {\r\n  margin: 0;\r\n  font-size: 13px;\r\n  font-weight: 600;\r\n  line-height: 1.5;\r\n}\r\n\r\n._4332a6a33a_stateLabel {\r\n  font-size: 11px;\r\n  line-height: 1.5;\r\n}\r\n\r\n._4332a6a33a_stateLabel[data-state='connected'] { color: var(--dsw-alias-state-success-primary); }\r\n._4332a6a33a_stateLabel[data-state='disconnected'] { color: var(--dsw-alias-state-warn-primary); }\r\n._4332a6a33a_stateLabel[data-state='unconfigured'] { color: var(--dsw-alias-state-error-primary); }\r\n\r\n._ba41be3e30_devicePill {\r\n  margin-left: auto;\r\n  max-width: 40%;\r\n  min-width: 0;\r\n}\r\n\r\n._b75bc11193_deviceName {\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n  font-family: var(--dsw-font-mono, var(--ds-font-family-code, ui-monospace, monospace));\r\n  font-size: 11px;\r\n}\r\n\r\n._8ef6007046_closeBtn {\r\n  flex: none;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  width: 24px;\r\n  height: 24px;\r\n  padding: 0;\r\n  border: none;\r\n  border-radius: 8px;\r\n  background: transparent;\r\n  color: var(--dsw-alias-label-tertiary);\r\n  cursor: pointer;\r\n  font-size: 14px;\r\n  line-height: 1;\r\n}\r\n\r\n._8ef6007046_closeBtn:hover { background: var(--dsw-alias-interactive-bg-hover); }\r\n\r\n/* ── 概览行 + 分段进度条 + 图例 ───────────────────────── */\r\n\r\n._b98b062ae4_overview {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 4px 12px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-secondary);\r\n  flex: none;\r\n}\r\n\r\n._f9ceb70e08_overviewStrong { font-weight: 600; color: var(--dsw-alias-label-primary); }\r\n\r\n._6173e78983_progress {\r\n  display: flex;\r\n  height: 6px;\r\n  border-radius: 999px;\r\n  overflow: hidden;\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  flex: none;\r\n}\r\n\r\n._3c51ca4f10_progressSegment { min-width: 0; transition: width 0.25s ease; }\r\n\r\n._3c51ca4f10_progressSegment[data-kind='in_progress'] { background: var(--dsw-alias-brand-primary, var(--dsw-alias-label-primary)); }\r\n._3c51ca4f10_progressSegment[data-kind='awaiting'] { background: var(--dsw-alias-state-warn-primary); }\r\n._3c51ca4f10_progressSegment[data-kind='deliverable'] { background: var(--dsw-alias-state-business-primary, var(--dsw-alias-state-success-primary)); }\r\n._3c51ca4f10_progressSegment[data-kind='done'] { background: var(--dsw-alias-state-success-primary); }\r\n\r\n._6aa7e1b232_legend {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 4px 12px;\r\n  font-size: 11px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n  flex: none;\r\n}\r\n\r\n._ae8d15ac0f_legendItem { display: inline-flex; align-items: center; gap: 5px; }\r\n\r\n._8ba80b2ca8_legendDot {\r\n  width: 7px;\r\n  height: 7px;\r\n  border-radius: 50%;\r\n  flex: none;\r\n}\r\n\r\n._8ba80b2ca8_legendDot[data-kind='in_progress'] { background: var(--dsw-alias-brand-primary, var(--dsw-alias-label-primary)); }\r\n._8ba80b2ca8_legendDot[data-kind='awaiting'] { background: var(--dsw-alias-state-warn-primary); }\r\n._8ba80b2ca8_legendDot[data-kind='deliverable'] { background: var(--dsw-alias-state-business-primary, var(--dsw-alias-state-success-primary)); }\r\n._8ba80b2ca8_legendDot[data-kind='done'] { background: var(--dsw-alias-state-success-primary); }\r\n\r\n/* ── 区块（同旧标签页 groupHead 语言） ────────────────── */\r\n\r\n._b757716fb4_section {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 8px;\r\n  flex: none;\r\n}\r\n\r\n._b7caaf0cc0_sectionHead {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n}\r\n\r\n._b6f52e55ab_sectionTitle {\r\n  margin: 0;\r\n  font-size: 12px;\r\n  font-weight: 600;\r\n  letter-spacing: 0.06em;\r\n  text-transform: uppercase;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._c58d195dad_count {\r\n  margin-left: auto;\r\n  border-radius: 999px;\r\n  padding: 1px 8px;\r\n  font-size: 11px;\r\n  line-height: 17px;\r\n  font-weight: 500;\r\n  white-space: nowrap;\r\n  background: var(--dsw-alias-bg-module-platform);\r\n  color: var(--dsw-alias-label-secondary);\r\n}\r\n\r\n._c4d76c9050_errorBanner {\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-state-error-primary);\r\n  border-left: 3px solid var(--dsw-alias-state-error-primary);\r\n  border-radius: 6px;\r\n  background: var(--dsw-alias-bg-layer-2);\r\n  padding: 6px 10px;\r\n  margin: 0;\r\n  overflow-wrap: anywhere;\r\n  flex: none;\r\n}\r\n\r\n/* ── avatar 主理卡 ────────────────────────────────────── */\r\n\r\n._3387c56315_avatarCard {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 10px;\r\n  padding: 12px;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  border-radius: 12px;\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  flex: none;\r\n}\r\n\r\n._bbfbf49530_avatarGlyph {\r\n  width: 34px;\r\n  height: 34px;\r\n  border-radius: 50%;\r\n  flex: none;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  font-size: 14px;\r\n  font-weight: 600;\r\n  color: var(--dsw-alias-label-secondary);\r\n  background: var(--dsw-alias-bg-layer-2);\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  user-select: none;\r\n}\r\n\r\n._4ef3ba0db5_avatarMain { min-width: 0; display: flex; flex-direction: column; gap: 1px; }\r\n\r\n._031e3e354f_avatarNameRow { display: flex; align-items: center; gap: 6px; min-width: 0; }\r\n\r\n._a66c773e32_avatarName {\r\n  font-size: 13px;\r\n  font-weight: 600;\r\n  line-height: 1.5;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n._2e74150e55_avatarSub {\r\n  font-size: 11px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n/* ── 成员卡 ───────────────────────────────────────────── */\r\n\r\n._33ff46d3c6_cards { display: flex; flex-direction: column; gap: 2px; }\r\n\r\n._ce9be87d1b_memberRow {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 10px;\r\n  padding: 8px 10px;\r\n  border-radius: 10px;\r\n  transition: background var(--ds-transition-duration-fast, 0.12s) var(--ds-ease-in-out, ease);\r\n}\r\n\r\n._ce9be87d1b_memberRow:hover { background: var(--dsw-alias-interactive-bg-hover); }\r\n\r\n._c707b62bb5_avatar {\r\n  width: 24px;\r\n  height: 24px;\r\n  border-radius: 50%;\r\n  flex: none;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  font-size: 11px;\r\n  font-weight: 600;\r\n  color: var(--dsw-alias-label-secondary);\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  user-select: none;\r\n}\r\n\r\n._5d676ff344_memberMain { min-width: 0; display: flex; flex-direction: column; gap: 1px; }\r\n\r\n._c7c101dfe1_memberNameRow { display: flex; align-items: center; gap: 6px; min-width: 0; }\r\n\r\n._bbcb5937ba_memberName {\r\n  font-size: 13px;\r\n  font-weight: 500;\r\n  line-height: 1.5;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n._704d46a71a_memberSub {\r\n  font-size: 11px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n._02ef8bae18_memberBadges { margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex: none; }\r\n\r\n._05ef26529a_badgeRow { display: flex; align-items: center; gap: 5px; }\r\n\r\n._059d81d160_badge {\r\n  font-size: 10px;\r\n  line-height: 16px;\r\n  padding: 0 6px;\r\n  border-radius: 999px;\r\n  white-space: nowrap;\r\n  background: var(--dsw-alias-bg-module-platform);\r\n  color: var(--dsw-alias-label-secondary);\r\n}\r\n\r\n._059d81d160_badge[data-kind='role'] {\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._059d81d160_badge[data-kind='running'] { color: var(--dsw-alias-state-success-primary); }\r\n._059d81d160_badge[data-kind='waiting'] { color: var(--dsw-alias-state-warn-primary); }\r\n\r\n._51a022450b_selfTag {\r\n  font-size: 10px;\r\n  line-height: 16px;\r\n  padding: 0 6px;\r\n  border-radius: 999px;\r\n  /* 主题自带对比保证的主按钮配对：fill + invert 标签。 */\r\n  background: var(--dsw-alias-button-primary-fill, var(--dsw-alias-label-primary));\r\n  color: var(--dsw-alias-brand-primary-invert, var(--dsw-alias-bg-base, #fff));\r\n  white-space: nowrap;\r\n}\r\n\r\n/* ── 任务链卡 + 详情 ──────────────────────────────────── */\r\n\r\n._5c259aea11_taskRow {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 4px;\r\n  padding: 10px 12px;\r\n  border: 1px solid var(--dsw-alias-border-l1);\r\n  border-radius: 10px;\r\n  background: var(--dsw-alias-bg-layer-2);\r\n  cursor: pointer;\r\n  text-align: left;\r\n  font: inherit;\r\n  color: inherit;\r\n  transition: border-color 0.16s, background 0.16s;\r\n}\r\n\r\n._5c259aea11_taskRow:hover { border-color: var(--dsw-alias-border-l2); }\r\n._5c259aea11_taskRow[data-selected='true'] { border-color: var(--dsw-alias-brand-primary, var(--dsw-alias-label-secondary)); }\r\n\r\n._4928aadfd0_taskHead { display: flex; align-items: center; gap: 8px; min-width: 0; }\r\n\r\n._e19e9d2264_taskId {\r\n  font-family: var(--dsw-font-mono, var(--ds-font-family-code, ui-monospace, monospace));\r\n  font-size: 12px;\r\n  font-weight: 600;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n._a158755a61_taskStatus {\r\n  margin-left: auto;\r\n  flex: none;\r\n  font-size: 10px;\r\n  line-height: 16px;\r\n  padding: 0 6px;\r\n  border-radius: 999px;\r\n  white-space: nowrap;\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  color: var(--dsw-alias-label-secondary);\r\n}\r\n\r\n._a158755a61_taskStatus[data-status='in_progress'] { color: var(--dsw-alias-brand-primary, var(--dsw-alias-label-primary)); }\r\n._a158755a61_taskStatus[data-status='awaiting'] { color: var(--dsw-alias-state-warn-primary); }\r\n._a158755a61_taskStatus[data-status='deliverable'] { color: var(--dsw-alias-state-business-primary, var(--dsw-alias-state-success-primary)); }\r\n._a158755a61_taskStatus[data-status='done'] { color: var(--dsw-alias-state-success-primary); }\r\n._a158755a61_taskStatus[data-status='archived'] { color: var(--dsw-alias-label-tertiary); }\r\n\r\n._ba70d6c8bd_taskGoal {\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-secondary);\r\n  overflow: hidden;\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 2;\r\n  -webkit-box-orient: vertical;\r\n}\r\n\r\n._07c8dd0182_taskMeta {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 2px 12px;\r\n  font-size: 11px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._07254cc9e1_detail { display: flex; flex-direction: column; gap: 8px; }\r\n\r\n._7ad9099075_detailBlock { display: flex; flex-direction: column; gap: 3px; }\r\n\r\n._626aa53c24_detailLabel {\r\n  font-size: 11px;\r\n  font-weight: 600;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._109de5e2ed_detailText {\r\n  font-size: 12px;\r\n  line-height: 1.55;\r\n  color: var(--dsw-alias-label-primary);\r\n  overflow-wrap: anywhere;\r\n  margin: 0;\r\n}\r\n\r\n._d9d53f74c8_criterion { display: flex; gap: 6px; font-size: 12px; line-height: 1.55; }\r\n\r\n._4335f84787_criterionMark { flex: none; }\r\n\r\n._5eab5c4b3e_criterionText { color: var(--dsw-alias-label-primary); overflow-wrap: anywhere; }\r\n\r\n._b104c92cb3_criterionEvidence { color: var(--dsw-alias-label-tertiary); }\r\n\r\n._630ee57446_depLink {\r\n  border: none;\r\n  background: none;\r\n  padding: 0;\r\n  font: inherit;\r\n  font-size: 12px;\r\n  color: var(--dsw-alias-brand-primary, var(--dsw-alias-label-secondary));\r\n  cursor: pointer;\r\n  text-decoration: underline;\r\n  text-underline-offset: 2px;\r\n}\r\n\r\n/* ── 依赖 DAG（SVG） ─────────────────────────────────── */\r\n\r\n._31d84b9ab2_graphScroll { overflow-x: auto; padding-bottom: 4px; }\r\n\r\n._4167a5f00f_graphNode { cursor: pointer; }\r\n\r\n._1540c29b50_graphNodeRect {\r\n  fill: var(--dsw-alias-bg-layer-3);\r\n  stroke: var(--dsw-alias-border-l2);\r\n}\r\n\r\n._4167a5f00f_graphNode[data-selected='true'] ._1540c29b50_graphNodeRect,\r\n._4167a5f00f_graphNode[data-hot='true'] ._1540c29b50_graphNodeRect { stroke: var(--dsw-alias-brand-primary, var(--dsw-alias-label-secondary)); }\r\n\r\n._4a1cf9da21_graphNodeText {\r\n  fill: var(--dsw-alias-label-primary);\r\n  font-size: 10px;\r\n  font-family: var(--dsw-font-mono, var(--ds-font-family-code, ui-monospace, monospace));\r\n}\r\n\r\n._1ea385c086_graphNodeGhost ._4a1cf9da21_graphNodeText { fill: var(--dsw-alias-label-tertiary); }\r\n\r\n._e881064438_graphEdge {\r\n  fill: none;\r\n  stroke: var(--dsw-alias-border-l2);\r\n  stroke-width: 1.4;\r\n}\r\n\r\n._e881064438_graphEdge[data-hot='true'] { stroke: var(--dsw-alias-brand-primary, var(--dsw-alias-label-secondary)); }\r\n\r\n._cfa89507e7_graphHint { font-size: 11px; line-height: 1.5; color: var(--dsw-alias-label-tertiary); }\r\n\r\n/* ── 停靠消息 + 空态 ─────────────────────────────────── */\r\n\r\n._0b10baf829_inboxRow {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 2px;\r\n  padding: 10px 12px;\r\n  border: 1px solid var(--dsw-alias-border-l1);\r\n  border-radius: 10px;\r\n  background: var(--dsw-alias-bg-layer-2);\r\n}\r\n\r\n._28ada1ee56_inboxFrom {\r\n  font-size: 12px;\r\n  font-weight: 600;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-secondary);\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n._8550ad6b06_inboxText {\r\n  font-size: 13px;\r\n  line-height: 1.55;\r\n  color: var(--dsw-alias-label-primary);\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n._5b80a45917_emptyWell {\r\n  padding: 14px;\r\n  border: 1px dashed var(--dsw-alias-border-l2);\r\n  border-radius: 10px;\r\n  text-align: center;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n/* ── 会话内卡片 ──────────────────────────────────────── */\r\n\r\n._dffd010aa7_toolCard {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 6px;\r\n  padding: 10px 12px;\r\n  border: 1px solid var(--dsw-alias-border-l1);\r\n  border-radius: 10px;\r\n  background: var(--dsw-alias-bg-layer-2);\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n}\r\n\r\n._a97ee53a41_toolCardHead { display: flex; align-items: center; gap: 8px; min-width: 0; }\r\n\r\n._5d62c25490_toolCardTitle { font-weight: 600; color: var(--dsw-alias-label-primary); flex: none; }\r\n\r\n._aae0c4265f_toolCardTo {\r\n  font-family: var(--dsw-font-mono, var(--ds-font-family-code, ui-monospace, monospace));\r\n  font-size: 11px;\r\n  color: var(--dsw-alias-label-secondary);\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n._5de0920b23_toolCardBody { color: var(--dsw-alias-label-primary); overflow-wrap: anywhere; }\r\n\r\n._638d7cbfbd_toolCardPreview {\r\n  color: var(--dsw-alias-label-secondary);\r\n  overflow: hidden;\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 2;\r\n  -webkit-box-orient: vertical;\r\n}\r\n\r\n._ac2b643e05_openPanelBtn {\r\n  align-self: flex-start;\r\n  border: none;\r\n  background: none;\r\n  padding: 0;\r\n  font: inherit;\r\n  font-size: 11px;\r\n  color: var(--dsw-alias-brand-primary, var(--dsw-alias-label-secondary));\r\n  cursor: pointer;\r\n  text-decoration: underline;\r\n  text-underline-offset: 2px;\r\n}\r\n\r\n._f19829d213_railTab {\r\n  position: absolute;\r\n  /* 与面板顶边（top: 80px）对齐，展开/收起时视觉连续。 */\r\n  top: 80px;\r\n  right: 0;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  gap: 8px;\r\n  padding: 12px 5px;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  border-right: none;\r\n  border-radius: 10px 0 0 10px;\r\n  background: var(--dsw-alias-bg-layer-2);\r\n  color: var(--dsw-alias-label-secondary);\r\n  cursor: pointer;\r\n  font: inherit;\r\n  transition: background var(--ds-transition-duration-fast, 0.12s) var(--ds-ease-in-out, ease);\r\n}\r\n\r\n._f19829d213_railTab:hover {\r\n  background: var(--dsw-alias-interactive-bg-hover);\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n/* 状态点：configured/connected 点亮（成功绿，主题自适应），未配置保持灰。 */\r\n._4e65e7e329_railDot {\r\n  width: 7px;\r\n  height: 7px;\r\n  border-radius: 50%;\r\n  flex: none;\r\n  background: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._4e65e7e329_railDot[data-configured='true'] {\r\n  background: var(--dsw-alias-state-success-primary);\r\n}\r\n\r\n._d156e1f883_railText {\r\n  writing-mode: vertical-rl;\r\n  font-size: 11px;\r\n  letter-spacing: 0.14em;\r\n  line-height: 1;\r\n  user-select: none;\r\n  white-space: nowrap;\r\n}\r\n";
const tagId$1 = "dsh-yuyi/YuyiPanel.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-yuyi";
	tag.dataset.pluginCss = tagId$1;
	tag.textContent = css$1;
	document.head.appendChild(tag);
}
var YuyiPanel_module_css_default = {
	"overlay": "_959fa70f95_overlay",
	"panel": "_aad0c9e117_panel",
	"head": "_e081c7e57e_head",
	"headTitle": "_b5ccd1ca3e_headTitle",
	"stateLabel": "_4332a6a33a_stateLabel",
	"devicePill": "_ba41be3e30_devicePill",
	"deviceName": "_b75bc11193_deviceName",
	"closeBtn": "_8ef6007046_closeBtn",
	"overview": "_b98b062ae4_overview",
	"overviewStrong": "_f9ceb70e08_overviewStrong",
	"progress": "_6173e78983_progress",
	"progressSegment": "_3c51ca4f10_progressSegment",
	"legend": "_6aa7e1b232_legend",
	"legendItem": "_ae8d15ac0f_legendItem",
	"legendDot": "_8ba80b2ca8_legendDot",
	"section": "_b757716fb4_section",
	"sectionHead": "_b7caaf0cc0_sectionHead",
	"sectionTitle": "_b6f52e55ab_sectionTitle",
	"count": "_c58d195dad_count",
	"errorBanner": "_c4d76c9050_errorBanner",
	"avatarCard": "_3387c56315_avatarCard",
	"avatarGlyph": "_bbfbf49530_avatarGlyph",
	"avatarMain": "_4ef3ba0db5_avatarMain",
	"avatarNameRow": "_031e3e354f_avatarNameRow",
	"avatarName": "_a66c773e32_avatarName",
	"avatarSub": "_2e74150e55_avatarSub",
	"cards": "_33ff46d3c6_cards",
	"memberRow": "_ce9be87d1b_memberRow",
	"avatar": "_c707b62bb5_avatar",
	"memberMain": "_5d676ff344_memberMain",
	"memberNameRow": "_c7c101dfe1_memberNameRow",
	"memberName": "_bbcb5937ba_memberName",
	"memberSub": "_704d46a71a_memberSub",
	"memberBadges": "_02ef8bae18_memberBadges",
	"badgeRow": "_05ef26529a_badgeRow",
	"badge": "_059d81d160_badge",
	"selfTag": "_51a022450b_selfTag",
	"taskRow": "_5c259aea11_taskRow",
	"taskHead": "_4928aadfd0_taskHead",
	"taskId": "_e19e9d2264_taskId",
	"taskStatus": "_a158755a61_taskStatus",
	"taskGoal": "_ba70d6c8bd_taskGoal",
	"taskMeta": "_07c8dd0182_taskMeta",
	"detail": "_07254cc9e1_detail",
	"detailBlock": "_7ad9099075_detailBlock",
	"detailLabel": "_626aa53c24_detailLabel",
	"detailText": "_109de5e2ed_detailText",
	"criterion": "_d9d53f74c8_criterion",
	"criterionMark": "_4335f84787_criterionMark",
	"criterionText": "_5eab5c4b3e_criterionText",
	"criterionEvidence": "_b104c92cb3_criterionEvidence",
	"depLink": "_630ee57446_depLink",
	"graphScroll": "_31d84b9ab2_graphScroll",
	"graphNode": "_4167a5f00f_graphNode",
	"graphNodeRect": "_1540c29b50_graphNodeRect",
	"graphNodeText": "_4a1cf9da21_graphNodeText",
	"graphNodeGhost": "_1ea385c086_graphNodeGhost",
	"graphEdge": "_e881064438_graphEdge",
	"graphHint": "_cfa89507e7_graphHint",
	"inboxRow": "_0b10baf829_inboxRow",
	"inboxFrom": "_28ada1ee56_inboxFrom",
	"inboxText": "_8550ad6b06_inboxText",
	"emptyWell": "_5b80a45917_emptyWell",
	"toolCard": "_dffd010aa7_toolCard",
	"toolCardHead": "_a97ee53a41_toolCardHead",
	"toolCardTitle": "_5d62c25490_toolCardTitle",
	"toolCardTo": "_aae0c4265f_toolCardTo",
	"toolCardBody": "_5de0920b23_toolCardBody",
	"toolCardPreview": "_638d7cbfbd_toolCardPreview",
	"openPanelBtn": "_ac2b643e05_openPanelBtn",
	"railTab": "_f19829d213_railTab",
	"railDot": "_4e65e7e329_railDot",
	"railText": "_d156e1f883_railText"
};

//#endregion
//#region src/client/panel/YuyiPanel.tsx
const DOT_STATE$1 = {
	connected: "done",
	disconnected: "warning",
	unconfigured: "error"
};
const EMPTY = {
	model: panelModel({
		configured: false,
		connected: false,
		device: "",
		sessions: []
	}, void 0),
	deviceInbox: []
};
function stateKey(state) {
	return `state.${state}`;
}
const LEGEND = [
	{
		kind: "in_progress",
		field: "inProgress",
		label: "legend.inProgress"
	},
	{
		kind: "awaiting",
		field: "awaiting",
		label: "legend.awaiting"
	},
	{
		kind: "deliverable",
		field: "deliverable",
		label: "legend.deliverable"
	},
	{
		kind: "done",
		field: "done",
		label: "legend.done"
	}
];
const NODE_W = 96;
const NODE_H = 26;
const NODE_GAP_X = 52;
const NODE_GAP_Y = 12;
/**

* 面板主体。

* @param props - 运行时套件、locale 与注入面。

* @returns 渲染出的面板；关闭时渲染 null。

*/
function YuyiPanel(props) {
	const { t, readStatus, readCollab, readInbox, onChange, panel } = props;
	const open = (0, react.useSyncExternalStore)(panel.subscribe, panel.getSnapshot);
	const [snapshot, setSnapshot] = (0, react.useState)(EMPTY);
	const [error, setError] = (0, react.useState)(void 0);
	const [selected, setSelected] = (0, react.useState)(void 0);
	const [hot, setHot] = (0, react.useState)(void 0);
	const refresh = (0, react.useCallback)(() => {
		(async () => {
			try {
				const status = await readStatus();
				let collab;
				try {
					collab = await readCollab();
				} catch {
					collab = void 0;
				}
				let entries;
				try {
					entries = await readInbox("device", true);
				} catch {
					entries = [];
				}
				setSnapshot({
					model: panelModel(status, collab),
					deviceInbox: inboxRows(entries)
				});
				setError(void 0);
			} catch (cause) {
				setError(String(cause));
			}
		})();
	}, [
		readStatus,
		readCollab,
		readInbox
	]);
	(0, react.useEffect)(() => {
		refresh();
		return onChange(refresh);
	}, [onChange, refresh]);
	const tKey = t;
	if (!open) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
		type: "button",
		className: YuyiPanel_module_css_default.railTab,
		"aria-label": tKey("toggle.open"),
		title: tKey("toggle.open"),
		onClick: () => panel.open(),
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: YuyiPanel_module_css_default.railDot,
			"data-configured": snapshot.model.state !== "unconfigured"
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: YuyiPanel_module_css_default.railText,
			children: tKey("panel.title")
		})]
	});
	const { model } = snapshot;
	const tasks = model.tasks;
	const layout = dagLayout(tasks);
	const hotSet = hot !== void 0 ? upstreamOf(layout, hot) : void 0;
	const selectedTask = tasks.find((task) => task.taskId === selected);
	const totalTasks = LEGEND.reduce((sum, entry) => sum + model.counts[entry.field], 0);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: YuyiPanel_module_css_default.panel,
		role: "complementary",
		"aria-label": tKey("panel.title"),
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
				className: YuyiPanel_module_css_default.head,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.StateDot, { state: DOT_STATE$1[model.state] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: YuyiPanel_module_css_default.stateLabel,
						"data-state": model.state,
						children: [
							tKey("panel.title"),
							" · ",
							tKey(stateKey(model.state))
						]
					}),
					model.device !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.Pill, {
						className: YuyiPanel_module_css_default.devicePill,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: YuyiPanel_module_css_default.deviceName,
							children: model.device
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: YuyiPanel_module_css_default.closeBtn,
						"aria-label": "close",
						onClick: panel.close,
						children: "✕"
					})
				]
			}),
			error !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
				className: YuyiPanel_module_css_default.errorBanner,
				children: [
					tKey("error.title"),
					": ",
					error
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: YuyiPanel_module_css_default.overview,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: YuyiPanel_module_css_default.overviewStrong,
							children: model.counts.members
						}),
						" ",
						tKey("overview.members")
					] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: YuyiPanel_module_css_default.overviewStrong,
							children: model.counts.done
						}),
						" ",
						tKey("overview.done")
					] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: YuyiPanel_module_css_default.overviewStrong,
							children: model.counts.awaiting
						}),
						" ",
						tKey("overview.pending")
					] })
				]
			}),
			totalTasks > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: YuyiPanel_module_css_default.progress,
				"aria-hidden": "true",
				children: LEGEND.map(({ kind, field }) => {
					const count = model.counts[field];
					if (count === 0) return null;
					return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: YuyiPanel_module_css_default.progressSegment,
						"data-kind": kind,
						style: { width: `${count / totalTasks * 100}%` }
					}, kind);
				})
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: YuyiPanel_module_css_default.legend,
				children: LEGEND.map(({ kind, field, label }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: YuyiPanel_module_css_default.legendItem,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: YuyiPanel_module_css_default.legendDot,
							"data-kind": kind
						}),
						tKey(label),
						" ",
						model.counts[field]
					]
				}, kind))
			})] }),
			model.avatar !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: YuyiPanel_module_css_default.avatarCard,
				"aria-label": tKey("role.avatar"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: YuyiPanel_module_css_default.avatarGlyph,
					"aria-hidden": "true",
					children: model.avatar.name.slice(0, 1).toUpperCase()
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: YuyiPanel_module_css_default.avatarMain,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: YuyiPanel_module_css_default.avatarNameRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: YuyiPanel_module_css_default.avatarName,
							children: model.avatar.name
						}), model.avatar.self && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: YuyiPanel_module_css_default.selfTag,
							children: "self"
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: YuyiPanel_module_css_default.avatarSub,
						children: [
							model.avatar.windows !== void 0 && model.avatar.windows > 0 ? `${model.avatar.windows} 个本机窗口 · ` : "",
							interpolate(tKey("member.running"), { count: model.avatar.running }),
							" · ",
							interpolate(tKey("member.waiting"), { count: model.avatar.waiting })
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
				title: tKey("roster.title"),
				count: model.members.length,
				children: model.members.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EmptyWell, { text: tKey("roster.empty") }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: YuyiPanel_module_css_default.cards,
					children: model.members.map((member) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: YuyiPanel_module_css_default.memberRow,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: YuyiPanel_module_css_default.avatar,
								"aria-hidden": "true",
								children: member.name.slice(0, 1).toUpperCase()
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: YuyiPanel_module_css_default.memberMain,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: YuyiPanel_module_css_default.memberNameRow,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: YuyiPanel_module_css_default.memberName,
										children: member.name
									}), member.self && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: YuyiPanel_module_css_default.selfTag,
										children: "self"
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: YuyiPanel_module_css_default.memberSub,
									children: [member.title !== member.name ? `${member.title} · ` : "", member.device]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: YuyiPanel_module_css_default.memberBadges,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: YuyiPanel_module_css_default.badgeRow,
										children: [member.role !== void 0 && member.role !== "avatar" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: YuyiPanel_module_css_default.badge,
											"data-kind": "role",
											children: tKey(`role.${member.role}`)
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: YuyiPanel_module_css_default.badge,
											"data-kind": member.presence === "awaiting" ? "waiting" : "presence",
											children: tKey(`presence.${member.presence}`)
										})]
									}),
									member.running > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: YuyiPanel_module_css_default.badge,
										"data-kind": "running",
										children: interpolate(tKey("member.running"), { count: member.running })
									}),
									member.waiting > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: YuyiPanel_module_css_default.badge,
										"data-kind": "waiting",
										children: interpolate(tKey("member.waiting"), { count: member.waiting })
									})
								]
							})
						]
					}, member.key))
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
				title: tKey("tasks.title"),
				count: tasks.length,
				children: tasks.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EmptyWell, { text: tKey("tasks.empty") }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: YuyiPanel_module_css_default.detail,
					children: [tasks.map((task) => {
						const status = taskStatusOf(task);
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: YuyiPanel_module_css_default.taskRow,
							"data-selected": task.taskId === selected,
							onClick: () => setSelected((previous) => previous === task.taskId ? void 0 : task.taskId),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: YuyiPanel_module_css_default.taskHead,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: YuyiPanel_module_css_default.taskId,
										children: task.taskId
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: YuyiPanel_module_css_default.taskStatus,
										"data-status": status,
										children: tKey(`task.${status}`)
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: YuyiPanel_module_css_default.taskGoal,
									children: task.goal?.description !== void 0 ? task.goal.description : interpolate(tKey("task.round"), { round: task.round })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: YuyiPanel_module_css_default.taskMeta,
									children: [
										task.pendingTarget !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: interpolate(tKey("task.pendingTo"), { target: task.pendingTarget }) }),
										task.goal !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: interpolate(tKey("task.acceptance"), {
											passed: task.verification?.filter((entry) => entry.passed).length ?? 0,
											total: task.goal.criteria.length
										}) }),
										task.dependsOn.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
											tKey("task.depends"),
											": ",
											task.dependsOn.map((dep) => dep.taskId).join(", ")
										] })
									]
								})
							]
						}, task.taskId);
					}), selectedTask !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TaskDetail, {
						task: selectedTask,
						tKey,
						onJump: setSelected
					})]
				})
			}),
			layout.edges.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Section, {
				title: tKey("graph.title"),
				count: layout.edges.length,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
					className: YuyiPanel_module_css_default.graphHint,
					children: [tKey("graph.hint"), layout.cycleEdges > 0 && ` · ${interpolate(tKey("graph.cycle"), { count: layout.cycleEdges })}`]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: YuyiPanel_module_css_default.graphScroll,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(GraphSvg, {
						layout,
						selected,
						hot,
						hotSet,
						onSelect: setSelected,
						onHot: setHot
					})
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
				title: tKey("messages.title"),
				count: snapshot.deviceInbox.length,
				children: snapshot.deviceInbox.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EmptyWell, { text: tKey("messages.empty") }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: YuyiPanel_module_css_default.cards,
					children: snapshot.deviceInbox.map((entry) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: YuyiPanel_module_css_default.inboxRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: YuyiPanel_module_css_default.inboxFrom,
							children: entry.from
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: YuyiPanel_module_css_default.inboxText,
							children: entry.text
						})]
					}, entry.id))
				})
			})
		]
	});
}
function Section({ title, count, children }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
		className: YuyiPanel_module_css_default.section,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: YuyiPanel_module_css_default.sectionHead,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
				className: YuyiPanel_module_css_default.sectionTitle,
				children: title
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: YuyiPanel_module_css_default.count,
				children: count
			})]
		}), children]
	});
}
function EmptyWell({ text }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: YuyiPanel_module_css_default.emptyWell,
		children: text
	});
}
function TaskDetail({ task, tKey, onJump }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: YuyiPanel_module_css_default.detail,
		children: [
			task.goal !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: YuyiPanel_module_css_default.detailBlock,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: YuyiPanel_module_css_default.detailLabel,
						children: interpolate(tKey("task.acceptance"), {
							passed: task.verification?.filter((entry) => entry.passed).length ?? 0,
							total: task.goal.criteria.length
						})
					}),
					task.goal.criteria.map((criterion, index) => {
						const verification = task.verification?.[index];
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: YuyiPanel_module_css_default.criterion,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: YuyiPanel_module_css_default.criterionMark,
								children: verification?.passed === true ? "✅" : "⏳"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: YuyiPanel_module_css_default.criterionText,
								children: [criterion, verification?.evidence !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: YuyiPanel_module_css_default.criterionEvidence,
									children: [" — ", verification.evidence]
								})]
							})]
						}, index);
					}),
					task.acceptanceComplete && task.closed !== true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: YuyiPanel_module_css_default.detailText,
						children: tKey("task.acceptanceDone")
					})
				]
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: YuyiPanel_module_css_default.detailBlock,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: YuyiPanel_module_css_default.detailLabel,
					children: tKey("task.goalEmpty")
				})
			}),
			task.assignee !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: YuyiPanel_module_css_default.detailBlock,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: YuyiPanel_module_css_default.detailLabel,
					children: tKey("task.assignee")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
					className: YuyiPanel_module_css_default.detailText,
					children: [task.assignee.target, task.assignee.phase !== void 0 ? ` · ${task.assignee.phase}` : ""]
				})]
			}),
			task.dependsOn.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: YuyiPanel_module_css_default.detailBlock,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: YuyiPanel_module_css_default.detailLabel,
					children: tKey("task.depends")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: YuyiPanel_module_css_default.detailText,
					children: task.dependsOn.map((dep, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
						index > 0 && "、",
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: YuyiPanel_module_css_default.depLink,
							onClick: () => onJump(dep.taskId),
							children: dep.taskId
						}),
						dep.note !== void 0 && `（${dep.note}）`
					] }, dep.taskId))
				})]
			}),
			task.artifacts.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: YuyiPanel_module_css_default.detailBlock,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: YuyiPanel_module_css_default.detailLabel,
					children: tKey("task.artifacts")
				}), task.artifacts.map((artifact) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
					className: YuyiPanel_module_css_default.detailText,
					children: [artifact.ref, artifact.note !== void 0 ? `（${artifact.note}）` : ""]
				}, artifact.ref))]
			})
		]
	});
}
function GraphSvg({ layout, selected, hot, hotSet, onSelect, onHot }) {
	const positions = new Map();
	layout.columns.forEach((column, columnIndex) => {
		column.forEach((node, rowIndex) => {
			positions.set(node.taskId, {
				x: columnIndex * (NODE_W + NODE_GAP_X),
				y: rowIndex * (NODE_H + NODE_GAP_Y)
			});
		});
	});
	const svgWidth = layout.columns.length * (NODE_W + NODE_GAP_X) - NODE_GAP_X;
	const svgHeight = Math.max(...layout.columns.map((column) => column.length), 1) * (NODE_H + NODE_GAP_Y) - NODE_GAP_Y;
	const active = hot ?? selected;
	const chain = active === void 0 ? void 0 : new Set([active, ...hotSet ?? []]);
	const edgeHot = (from, to) => chain !== void 0 && chain.has(from) && (chain.has(to) || to === active);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		width: svgWidth,
		height: svgHeight,
		viewBox: `0 0 ${svgWidth} ${svgHeight}`,
		role: "img",
		onMouseLeave: () => onHot(void 0),
		children: [layout.edges.map((edge) => {
			const from = positions.get(edge.from);
			const to = positions.get(edge.to);
			if (from === void 0 || to === void 0) return null;
			const x1 = from.x + NODE_W;
			const y1 = from.y + NODE_H / 2;
			const x2 = to.x;
			const y2 = to.y + NODE_H / 2;
			const mid = (x1 + x2) / 2;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				className: YuyiPanel_module_css_default.graphEdge,
				"data-hot": edgeHot(edge.from, edge.to),
				d: `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`
			}, `${edge.from}->${edge.to}`);
		}), layout.columns.map((column, columnIndex) => column.map((node, rowIndex) => {
			const position = positions.get(node.taskId);
			if (position === void 0) return null;
			const isSelected = node.taskId === selected;
			const isHot = active !== void 0 && (node.taskId === active || chain?.has(node.taskId) === true);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
				className: `${YuyiPanel_module_css_default.graphNode} ${node.ghost ? YuyiPanel_module_css_default.graphNodeGhost : ""}`,
				"data-selected": isSelected,
				"data-hot": isHot,
				transform: `translate(${position.x}, ${position.y})`,
				onClick: () => onSelect(isSelected ? void 0 : node.taskId),
				onMouseEnter: () => onHot(node.taskId),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
					className: YuyiPanel_module_css_default.graphNodeRect,
					width: NODE_W,
					height: NODE_H,
					rx: 8
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("text", {
					className: YuyiPanel_module_css_default.graphNodeText,
					x: 10,
					y: 17,
					children: [node.taskId.length > 12 ? `${node.taskId.slice(0, 11)}…` : node.taskId, node.ghost ? " ∅" : ""]
				})]
			}, node.taskId);
		}))]
	});
}

//#endregion
//#region src/client/panel/store.ts
/**

* 面板开合 store：shell.overlay 面板、头部工具钮与会话内

* 卡片的「活动面板」链接共用的同一真源。每次客户端

* apply 创建一个实例（无模块级单例，随宿主生命周期走）。

*

* 用户的开合选择持久化在 localStorage（`dsh-yuyi/panel`）；

* 未做过选择时 store 保持关闭，由 apply 侧的「已配置即

* 首次展开」逻辑接管——未配置御驿的用户永远不被空面板打扰。

* @module dsh-yuyi/client/panel/store

*/
const STORAGE_KEY = "dsh-yuyi/panel";
function readStored() {
	try {
		const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
		if (raw === "open") return true;
		if (raw === "closed") return false;
		return void 0;
	} catch {
		return void 0;
	}
}
function writeStored(open) {
	try {
		if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, open ? "open" : "closed");
	} catch {}
}
/**

* 创建一个面板开合 store（每次调用新实例）。

* @returns 可观察的开合 store。

*/
function createPanelStore() {
	let open = readStored() ?? false;
	let touched = false;
	const listeners = new Set();
	const publish = () => {
		for (const listener of [...listeners]) listener();
	};
	const set = (next) => {
		touched = true;
		if (open === next) return;
		open = next;
		writeStored(next);
		publish();
	};
	return {
		getSnapshot: () => open,
		subscribe: (listener) => {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		open: () => {
			set(true);
		},
		close: () => {
			set(false);
		},
		toggle: () => {
			set(!open);
		},
		hasUserChoice: () => touched || readStored() !== void 0
	};
}

//#endregion
//#region src/client/cards.tsx
function isRunning(block) {
	return block.kind !== "tool-result";
}
function argsOf(block) {
	const raw = isRunning(block) ? block.argsRaw : block.call?.argsRaw;
	if (raw === void 0 || raw === null) return {};
	try {
		const parsed = JSON.parse(raw);
		return typeof parsed === "object" && parsed !== null ? parsed : {};
	} catch {
		return {};
	}
}
function resultText(block) {
	if (isRunning(block)) return void 0;
	const { content } = block;
	const text = content.filter((part) => part.type === "text").map((part) => part.text ?? "").join("");
	return text.length > 0 ? text : void 0;
}
function resultValue(block) {
	const text = resultText(block);
	if (text === void 0) return void 0;
	try {
		return JSON.parse(text);
	} catch {
		return void 0;
	}
}
function OpenPanel({ t, panel }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
		type: "button",
		className: YuyiPanel_module_css_default.openPanelBtn,
		onClick: () => panel.open(),
		children: t("card.openPanel")
	});
}
function CardHead({ title, to, badge }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: YuyiPanel_module_css_default.toolCardHead,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: YuyiPanel_module_css_default.toolCardTitle,
				children: title
			}),
			to !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: YuyiPanel_module_css_default.toolCardTo,
				children: to
			}),
			badge !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: YuyiPanel_module_css_default.taskStatus,
				"data-status": badge.kind,
				children: badge.label
			})
		]
	});
}
function YuyiSendCard(props) {
	const { t, panel, block } = props;
	const args = argsOf(block);
	const result = resultValue(block);
	const delivered = result?.deliveredAs;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: YuyiPanel_module_css_default.toolCard,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(CardHead, {
				title: t("card.send"),
				to: args.to,
				badge: delivered !== void 0 ? {
					kind: delivered === "notify" ? "done" : "awaiting",
					label: t(`card.delivered.${delivered}`)
				} : void 0
			}),
			args.text !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: YuyiPanel_module_css_default.toolCardPreview,
				children: args.text
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(OpenPanel, {
				t,
				panel
			})
		]
	});
}
function YuyiTaskContinueCard(props) {
	const { t, panel, block } = props;
	const args = argsOf(block);
	const result = resultValue(block);
	const to = result?.to ?? args.to;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: YuyiPanel_module_css_default.toolCard,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(CardHead, {
				title: args.task_id ?? "",
				to
			}),
			result?.replyText !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: YuyiPanel_module_css_default.toolCardBody,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: YuyiPanel_module_css_default.toolCardTo,
					children: result.replyFrom ?? ""
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: YuyiPanel_module_css_default.toolCardPreview,
					children: result.replyText
				})]
			}) : args.message !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: YuyiPanel_module_css_default.toolCardPreview,
				children: args.message
			}) : null,
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(OpenPanel, {
				t,
				panel
			})
		]
	});
}
function YuyiTaskShowCard(props) {
	const { t, panel, block } = props;
	const args = argsOf(block);
	const result = resultValue(block);
	const taskId = result?.taskId ?? args.task_id;
	const passed = result?.verification?.filter((entry) => entry.passed).length ?? 0;
	const total = result?.goal?.criteria?.length ?? 0;
	const status = result === void 0 ? void 0 : result.archived === true ? "archived" : result.closed === true ? "done" : "in_progress";
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: YuyiPanel_module_css_default.toolCard,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(CardHead, {
				title: taskId ?? "",
				badge: status !== void 0 && status !== "in_progress" ? {
					kind: status,
					label: t(`task.${status}`)
				} : void 0
			}),
			result?.goal?.description !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: YuyiPanel_module_css_default.toolCardPreview,
				children: result.goal.description
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: YuyiPanel_module_css_default.taskMeta,
				children: [
					result?.round !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: interpolate(t("task.round"), { round: result.round }) }),
					result?.pendingTarget !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: interpolate(t("task.pendingTo"), { target: result.pendingTarget }) }),
					total > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: interpolate(t("task.acceptance"), {
						passed,
						total
					}) }),
					result?.dependsOn !== void 0 && result.dependsOn.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
						t("task.depends"),
						": ",
						result.dependsOn.map((dep) => dep.taskId).join(", ")
					] })
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(OpenPanel, {
				t,
				panel
			})
		]
	});
}
function YuyiPeersCard(props) {
	const { t, panel, block } = props;
	const result = resultValue(block);
	const devices = result?.devices ?? [];
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: YuyiPanel_module_css_default.toolCard,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(CardHead, { title: t("card.peers") }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: YuyiPanel_module_css_default.cards,
				children: devices.map((device) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: YuyiPanel_module_css_default.memberRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: YuyiPanel_module_css_default.avatar,
						"aria-hidden": "true",
						children: device.device.slice(0, 1).toUpperCase()
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: YuyiPanel_module_css_default.memberMain,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: YuyiPanel_module_css_default.memberNameRow,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: YuyiPanel_module_css_default.memberName,
								children: device.device
							}), device.role !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: YuyiPanel_module_css_default.badge,
								"data-kind": "role",
								children: t(`role.${device.role}`)
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: YuyiPanel_module_css_default.memberSub,
							children: (device.sessions ?? []).map((session) => session.name ?? session.sessionID).join(", ")
						})]
					})]
				}, `${device.device}`))
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(OpenPanel, {
				t,
				panel
			})
		]
	});
}
const COLLAB_CARDS = {
	yuyi_send: YuyiSendCard,
	yuyi_task_continue: YuyiTaskContinueCard,
	yuyi_task_show: YuyiTaskShowCard,
	yuyi_peers: YuyiPeersCard
};

//#endregion
//#region src/client/settings/settings-contract.ts
/**

* 宿主 `yuyi` 设置命名空间（`dsh-yuyi` 的 Config）的浏览器镜像：

* 本区块编辑的连接字段。宿主 schema 仍为

* 为权威；这份结构镜像存在是因为浏览器 bundle 不得

* 引用宿主能力包的程序（只有其纯类型

* `/types` 座位，它不携带设置契约）。

*/
const YUYI_SETTINGS_NAMESPACE = "yuyi";
const CONNECTION_FIELDS = [
	{
		field: "hub",
		kind: "text"
	},
	{
		field: "device",
		kind: "text"
	},
	{
		field: "replyTimeoutMs",
		kind: "number"
	}
];

//#endregion
//#region src/client/settings/locales.ts
const zh$1 = {
	"nav": "御驿",
	"title": "御驿连接",
	"description": "Hub 地址、设备身份、令牌与等回复超时；保存后立即重连。",
	"status.heading": "连接状态",
	"status.loading": "读取中…",
	"status.connected": "已连接",
	"status.disconnected": "未连接",
	"status.unconfigured": "未配置",
	"status.hub": "Hub",
	"status.device": "设备",
	"status.agent": "智能体",
	"status.owner": "所有者",
	"status.token": "令牌",
	"status.tokenFound": "已解析",
	"status.tokenMissing": "未找到",
	"status.lastError": "最近错误",
	"field.hub": "Hub 地址",
	"field.device": "设备名（默认自动填入本机名）",
	"field.tokenEnv": "令牌环境变量名（填变量名，不是令牌值）",
	"field.token": "令牌（本适配器专属）",
	"token.configured": "已配置",
	"token.missing": "未配置",
	"token.hint": "只写不读：存入本机凭证库，界面永不回显。御驿一机多 Agent，令牌按 Agent 签发，此处只写 dsh 适配器自己的。",
	"action.clear": "清除",
	"field.replyTimeoutMs": "等回复超时（毫秒）",
	"field.overridden": "已覆盖",
	"field.invalidNumber": "需要正整数（毫秒）",
	"hint.hub": "Hub 的 WebSocket 地址，如 ws://主机:7377；清空保存后回退到环境链。",
	"hint.device": "本机对外身份名；默认自动填入当前设备名，清空保存即恢复自动。",
	"hint.replyTimeoutMs": "等待对端回复的毫秒预算，超时按失败处理。",
	"action.save": "保存",
	"action.discard": "放弃",
	"action.reset": "重置",
	"note.unavailable": "设置需要本机连接（loopback）才能编辑；远程浏览器连接为只读。",
	"note.loading": "正在读取设置…"
};
const en$1 = {
	"nav": "Yuyi",
	"title": "Yuyi connection",
	"description": "Hub URL, device identity, token, and reply timeout; saving reconnects live.",
	"status.heading": "Connection",
	"status.loading": "Reading…",
	"status.connected": "Connected",
	"status.disconnected": "Disconnected",
	"status.unconfigured": "Not configured",
	"status.hub": "Hub",
	"status.device": "Device",
	"status.agent": "Agent",
	"status.owner": "Owner",
	"status.token": "Token",
	"status.tokenFound": "resolved",
	"status.tokenMissing": "not found",
	"status.lastError": "Last error",
	"field.hub": "Hub URL",
	"field.device": "Device name (auto-filled from this machine)",
	"field.tokenEnv": "Token env var name (the NAME, not the token itself)",
	"field.token": "Token (this adapter only)",
	"token.configured": "Configured",
	"token.missing": "Not configured",
	"token.hint": "Write-only: stored in the local credential store, never echoed back. Yuyi hosts multiple agents per machine with per-agent tokens — this writes only the dsh adapter's own.",
	"action.clear": "Clear",
	"field.replyTimeoutMs": "Reply timeout (ms)",
	"field.overridden": "overridden",
	"field.invalidNumber": "Must be a positive integer (ms)",
	"hint.hub": "The hub's WebSocket URL, e.g. ws://host:7377; clear and save to fall back to the environment chain.",
	"hint.device": "This machine's public identity; auto-filled with the current device name — clear and save to return to automatic.",
	"hint.replyTimeoutMs": "How long to wait for a peer's reply, in milliseconds; a timeout counts as failure.",
	"action.save": "Save",
	"action.discard": "Discard",
	"action.reset": "Reset",
	"note.unavailable": "Editing settings requires a loopback connection; remote browsers are read-only.",
	"note.loading": "Loading settings…"
};
const NS$1 = "settings.yuyi";
/**

* 一个字段的文案键，按组件渲染的方式寻址。

* @param field - 要返回文案键的连接字段。

* @returns 承载字段文案的字典键。

*/
function fieldLabelKey(field) {
	return `field.${field}`;
}

//#endregion
//#region src/client/settings/model.ts
/**

* 一个字段输入框显示的草稿串。

* @param value - 解析后的设置节；首次接受前为 undefined。

* @param field - 要显示的字段。

* @returns 字段当前值对应的输入文本，未设或未解析时为空。

*/
function fieldDraft(value, field) {
	const raw = value?.[field];
	return raw === void 0 ? "" : String(raw);
}
/**

* 草稿是否可写。`tokenEnv` 必须是合法的环境变量名（POSIX 标识符）——令牌值

* 不属于这里，误粘令牌会被拦下；超时必须是正整数。

* @param field - 正在编辑的字段。

* @param draft - 输入框当前文本。

* @returns {@link draftWrite} 是否会产生写入。

*/
function draftValid(field, draft) {
	if (field === "replyTimeoutMs") return /^\d+$/.test(draft.trim()) && Number(draft.trim()) > 0;
	if (field === "tokenEnv") return /^[A-Za-z_][A-Za-z0-9_]*$/.test(draft.trim());
	return true;
}
/**

* 把一个有效草稿映射为其设置写入。清空 `hub` 或 `device`

* 即清除覆盖（环境链接管）；超时

* 被强转为数字。

* @param field - 正在提交的字段。

* @param draft - 输入框文本（已经 {@link draftValid} 校验）。

* @returns 区块路由进作用域的写入。

*/
function draftWrite(field, draft) {
	if (field === "replyTimeoutMs") return {
		op: "set",
		value: Number(draft.trim())
	};
	if (field === "tokenEnv") return {
		op: "set",
		value: draft.trim()
	};
	return draft.trim().length === 0 ? { op: "unset" } : {
		op: "set",
		value: draft.trim()
	};
}
/**

* 从原始设置用户层读出用户覆盖集合。

* @param user - 快照的原始用户层（`unknown`：线路数据）。

* @returns 该层中存在的字段——存在性而非取值标记覆盖。

*/
function userOverrides(user) {
	if (typeof user !== "object" || user === null) return new Set();
	const record = user;
	const fields = [
		"hub",
		"device",
		"tokenEnv",
		"replyTimeoutMs"
	];
	return new Set(fields.filter((field) => record[field] !== void 0));
}

//#endregion
//#region \0dsh-yuyi-css:E:\code\nodejs\dsh\dsh-yuyi\src\client\settings\YuyiSettingsSection.module.css.mjs
const css = "/* 御驿设置区块：整页框架、状态卡、字段行、页脚动作全部对齐\r\n   产品设置页语义（--dsw-alias-* 令牌 + settings 页的既有度量）。 */\r\n\r\n._9af6a1e487_section {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 12px;\r\n  max-width: 720px;\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n._2fafc609b6_title {\r\n  margin: 0;\r\n  font-size: 18px;\r\n  font-weight: 600;\r\n  line-height: 1.4;\r\n}\r\n\r\n._09848b69ed_intro {\r\n  margin: 0;\r\n  font-size: 13px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n/* ── 状态卡（产品卡片框架） ─────────────────────────────── */\r\n\r\n._aec5ef2840_statusCard {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 8px;\r\n  padding: 14px 16px;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  border-radius: 12px;\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  transition: border-color 0.16s, background 0.16s;\r\n}\r\n\r\n._f41c601b5f_statusHead {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n  min-width: 0;\r\n}\r\n\r\n._72cf703c5d_stateLabel {\r\n  font-size: 13px;\r\n  font-weight: 600;\r\n  line-height: 1.5;\r\n}\r\n\r\n._72cf703c5d_stateLabel[data-state='connected'] { color: var(--dsw-alias-state-success-primary); }\r\n._72cf703c5d_stateLabel[data-state='disconnected'] { color: var(--dsw-alias-state-warn-primary); }\r\n._72cf703c5d_stateLabel[data-state='unconfigured'] { color: var(--dsw-alias-state-error-primary); }\r\n\r\n._a6582a0792_devicePill {\r\n  margin-left: auto;\r\n  max-width: 60%;\r\n  min-width: 0;\r\n}\r\n\r\n._b86fe4b080_deviceName {\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n  font-family: var(--dsw-font-mono, var(--ds-font-family-code, ui-monospace, monospace));\r\n  font-size: 11px;\r\n}\r\n\r\n._d95a509cd2_facts {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 4px;\r\n  margin: 0;\r\n}\r\n\r\n._64ecc8ebc5_fact {\r\n  display: flex;\r\n  gap: 8px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n}\r\n\r\n._31f7aef80c_factKey {\r\n  flex: none;\r\n  min-width: 56px;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._ffda5f645a_factValue {\r\n  margin: 0;\r\n  color: var(--dsw-alias-label-secondary);\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n._231a1b8880_lastError {\r\n  margin: 0;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-state-error-primary);\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n._23f9f55a6b_note {\r\n  margin: 0;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n/* ── 字段行（产品 fields 语言：行间细分隔线） ────────────── */\r\n\r\n._46d5069d7a_fields {\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n._20628119f7_field {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 6px;\r\n  padding: 12px 0;\r\n}\r\n\r\n._20628119f7_field + ._20628119f7_field {\r\n  border-top: 1px solid var(--dsw-alias-border-l2);\r\n}\r\n\r\n._28a697a780_fieldHead {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n}\r\n\r\n._6766e32480_fieldLabel {\r\n  flex: 1;\r\n  min-width: 0;\r\n  font-size: 13px;\r\n  font-weight: 500;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n._509d2a0aec_badges {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n}\r\n\r\n._f0d03244c2_badge {\r\n  border-radius: 999px;\r\n  padding: 1px 8px;\r\n  font-size: 11px;\r\n  line-height: 17px;\r\n  white-space: nowrap;\r\n  font-weight: 500;\r\n  background: var(--dsw-alias-bg-module-platform);\r\n  color: var(--dsw-alias-label-secondary);\r\n}\r\n\r\n._09192cce93_badgeMuted {\r\n  border-radius: 999px;\r\n  padding: 1px 8px;\r\n  font-size: 11px;\r\n  line-height: 17px;\r\n  white-space: nowrap;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._571b620276_textButton {\r\n  border: none;\r\n  background: none;\r\n  padding: 0;\r\n  font: inherit;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-secondary);\r\n  cursor: pointer;\r\n}\r\n\r\n._571b620276_textButton:hover:not(:disabled) {\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n._571b620276_textButton:disabled {\r\n  cursor: default;\r\n  opacity: 0.5;\r\n}\r\n\r\n._13da1bfc59_input {\r\n  height: 34px;\r\n  padding: 0 12px;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  border-radius: 8px;\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  font: inherit;\r\n  font-size: 13px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n._13da1bfc59_input:focus-visible {\r\n  outline: none;\r\n  border-color: var(--dsw-alias-brand-primary);\r\n}\r\n\r\n._13da1bfc59_input:disabled {\r\n  color: var(--dsw-alias-label-tertiary);\r\n  cursor: default;\r\n}\r\n\r\n._b191371ded_inputInvalid {\r\n  height: 34px;\r\n  padding: 0 12px;\r\n  border: 1px solid var(--dsw-alias-state-error-primary);\r\n  border-radius: 8px;\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  font: inherit;\r\n  font-size: 13px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n._b191371ded_inputInvalid:focus-visible {\r\n  outline: none;\r\n  border-color: var(--dsw-alias-state-error-primary);\r\n}\r\n\r\n._b191371ded_inputInvalid:disabled {\r\n  color: var(--dsw-alias-label-tertiary);\r\n  cursor: default;\r\n}\r\n\r\n._e5146969ff_hint {\r\n  margin: 0;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._fe16dbaf1c_invalidHint {\r\n  margin: 0;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-state-error-primary);\r\n}\r\n\r\n/* ── 页脚（产品卡片 footer：右对齐 放弃/保存） ────────────── */\r\n\r\n._eda4f6843e_footer {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: flex-end;\r\n  gap: 8px;\r\n  padding: 12px 0 4px;\r\n  border-top: 1px solid var(--dsw-alias-border-l2);\r\n}\r\n\r\n._637928dfbb_failed {\r\n  flex: 1;\r\n  min-width: 0;\r\n  margin: 0;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-state-error-primary);\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n._62d59546fd_discard,\r\n._b4dc7a67a1_save {\r\n  appearance: none;\r\n  border: 1px solid transparent;\r\n  border-radius: 8px;\r\n  padding: 5px 14px;\r\n  font: inherit;\r\n  font-size: 13px;\r\n  line-height: 1.5;\r\n  cursor: pointer;\r\n}\r\n\r\n._62d59546fd_discard {\r\n  border-color: var(--dsw-alias-border-l2);\r\n  background: none;\r\n  color: var(--dsw-alias-label-secondary);\r\n}\r\n\r\n._62d59546fd_discard:hover:not(:disabled) {\r\n  color: var(--dsw-alias-label-primary);\r\n  border-color: var(--dsw-alias-label-dimmed);\r\n}\r\n\r\n._b4dc7a67a1_save {\r\n  background: var(--dsw-alias-label-primary);\r\n  color: var(--dsw-alias-bg-layer-3);\r\n}\r\n\r\n._62d59546fd_discard:disabled,\r\n._b4dc7a67a1_save:disabled {\r\n  opacity: 0.4;\r\n  cursor: default;\r\n}\r\n\r\n._62d59546fd_discard:focus-visible,\r\n._b4dc7a67a1_save:focus-visible {\r\n  outline: 2px solid var(--dsw-alias-brand-primary);\r\n  outline-offset: 1px;\r\n}\r\n";
const tagId = "dsh-yuyi/YuyiSettingsSection.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-yuyi";
	tag.dataset.pluginCss = tagId;
	tag.textContent = css;
	document.head.appendChild(tag);
}
var YuyiSettingsSection_module_css_default = {
	"section": "_9af6a1e487_section",
	"title": "_2fafc609b6_title",
	"intro": "_09848b69ed_intro",
	"statusCard": "_aec5ef2840_statusCard",
	"statusHead": "_f41c601b5f_statusHead",
	"stateLabel": "_72cf703c5d_stateLabel",
	"devicePill": "_a6582a0792_devicePill",
	"deviceName": "_b86fe4b080_deviceName",
	"facts": "_d95a509cd2_facts",
	"fact": "_64ecc8ebc5_fact",
	"factKey": "_31f7aef80c_factKey",
	"factValue": "_ffda5f645a_factValue",
	"lastError": "_231a1b8880_lastError",
	"note": "_23f9f55a6b_note",
	"fields": "_46d5069d7a_fields",
	"field": "_20628119f7_field",
	"fieldHead": "_28a697a780_fieldHead",
	"fieldLabel": "_6766e32480_fieldLabel",
	"badges": "_509d2a0aec_badges",
	"badge": "_f0d03244c2_badge",
	"badgeMuted": "_09192cce93_badgeMuted",
	"textButton": "_571b620276_textButton",
	"input": "_13da1bfc59_input",
	"inputInvalid": "_b191371ded_inputInvalid",
	"hint": "_e5146969ff_hint",
	"invalidHint": "_fe16dbaf1c_invalidHint",
	"footer": "_eda4f6843e_footer",
	"failed": "_637928dfbb_failed",
	"discard": "_62d59546fd_discard",
	"save": "_b4dc7a67a1_save"
};

//#endregion
//#region src/client/settings/YuyiSettingsSection.tsx
const DOT_STATE = {
	connected: "done",
	disconnected: "warning",
	unconfigured: "error"
};
/**

* 渲染御驿连接设置区块。

* @param props - 组合插槽 props。

* @returns 区块元素树。

*/
function YuyiSettingsSection({ useSettings, useStatus, save, reset, token, t }) {
	const settings = useSettings((snapshot) => snapshot);
	const statusState = useStatus((snapshot) => snapshot);
	const [drafts, setDrafts] = (0, react.useState)({});
	(0, react.useEffect)(() => {
		setDrafts({});
	}, [settings.value]);
	const [tokenState, setTokenState] = (0, react.useState)(void 0);
	const [tokenDraft, setTokenDraft] = (0, react.useState)("");
	const [saveError, setSaveError] = (0, react.useState)(void 0);
	const refreshToken = () => {
		token.read().then(setTokenState, () => setTokenState(void 0));
	};
	(0, react.useEffect)(() => {
		refreshToken();
		return token.onChange(refreshToken);
	}, [token]);
	const status = statusState.current;
	const editable = settings.status === "ready" && settings.writable;
	const overrides = userOverrides(settings.user);
	const basisOf = (field) => {
		if (field === "device" && (settings.value?.device ?? "") === "" && status !== void 0) return status.device;
		return fieldDraft(settings.value, field);
	};
	const draftOf = (field) => drafts[field] ?? basisOf(field);
	const dirtyFields = CONNECTION_FIELDS.filter(({ field }) => draftOf(field) !== basisOf(field));
	const hasInvalid = dirtyFields.some(({ field }) => !draftValid(field, draftOf(field)));
	const tokenDirty = tokenDraft.trim() !== "";
	const canSave = editable && (dirtyFields.length > 0 || tokenDirty) && !hasInvalid;
	const saveAll = async () => {
		if (!canSave) return;
		try {
			for (const { field } of dirtyFields) {
				const write = draftWrite(field, draftOf(field));
				await (write.op === "set" ? save(field, write.value) : reset(field));
			}
			if (tokenDirty) {
				await token.save(tokenDraft.trim());
				setTokenDraft("");
			}
			setSaveError(void 0);
		} catch (error) {
			setSaveError(error instanceof Error ? error.message : String(error));
		}
		refreshToken();
	};
	const discardAll = () => {
		setDrafts({});
		setTokenDraft("");
		setSaveError(void 0);
	};
	const clearToken = async () => {
		try {
			await token.clear();
			setSaveError(void 0);
		} catch (error) {
			setSaveError(error instanceof Error ? error.message : String(error));
		}
		refreshToken();
	};
	const connection = status === void 0 ? "unconfigured" : status.connected ? "connected" : status.configured ? "disconnected" : "unconfigured";
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: YuyiSettingsSection_module_css_default.section,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
				className: YuyiSettingsSection_module_css_default.title,
				children: t("title")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: YuyiSettingsSection_module_css_default.intro,
				children: t("description")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: YuyiSettingsSection_module_css_default.statusCard,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: YuyiSettingsSection_module_css_default.statusHead,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.StateDot, { state: DOT_STATE[connection] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: YuyiSettingsSection_module_css_default.stateLabel,
								"data-state": connection,
								children: status === void 0 ? t("status.loading") : status.connected ? t("status.connected") : status.configured ? t("status.disconnected") : t("status.unconfigured")
							}),
							status !== void 0 && status.device !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.Pill, {
								className: YuyiSettingsSection_module_css_default.devicePill,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: YuyiSettingsSection_module_css_default.deviceName,
									children: status.device
								})
							})
						]
					}),
					status !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dl", {
						className: YuyiSettingsSection_module_css_default.facts,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: YuyiSettingsSection_module_css_default.fact,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", {
									className: YuyiSettingsSection_module_css_default.factKey,
									children: t("status.hub")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", {
									className: YuyiSettingsSection_module_css_default.factValue,
									children: status.hub.length > 0 ? status.hub : "—"
								})]
							}),
							status.agentName !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: YuyiSettingsSection_module_css_default.fact,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", {
									className: YuyiSettingsSection_module_css_default.factKey,
									children: t("status.agent")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", {
									className: YuyiSettingsSection_module_css_default.factValue,
									children: status.agentName
								})]
							}),
							status.ownerUsername !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: YuyiSettingsSection_module_css_default.fact,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", {
									className: YuyiSettingsSection_module_css_default.factKey,
									children: t("status.owner")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", {
									className: YuyiSettingsSection_module_css_default.factValue,
									children: status.ownerUsername
								})]
							})
						]
					}),
					status?.lastError !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: YuyiSettingsSection_module_css_default.lastError,
						role: "alert",
						children: [
							t("status.lastError"),
							": ",
							status.lastError
						]
					})
				]
			}),
			settings.status === "unavailable" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: YuyiSettingsSection_module_css_default.note,
				children: t("note.unavailable")
			}),
			settings.status === "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: YuyiSettingsSection_module_css_default.note,
				children: t("note.loading")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: YuyiSettingsSection_module_css_default.fields,
				children: [CONNECTION_FIELDS.map(({ field, kind }) => {
					const basis = basisOf(field);
					const draft = drafts[field] ?? basis;
					const changed = draft !== basis;
					const invalid = changed && !draftValid(field, draft);
					return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: YuyiSettingsSection_module_css_default.field,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: YuyiSettingsSection_module_css_default.fieldHead,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
									className: YuyiSettingsSection_module_css_default.fieldLabel,
									htmlFor: `yuyi-${field}`,
									children: t(fieldLabelKey(field))
								}), overrides.has(field) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: YuyiSettingsSection_module_css_default.badges,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: YuyiSettingsSection_module_css_default.badge,
										children: t("field.overridden")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: YuyiSettingsSection_module_css_default.textButton,
										disabled: !editable,
										onClick: () => {
											reset(field);
										},
										children: t("action.reset")
									})]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								id: `yuyi-${field}`,
								className: invalid ? YuyiSettingsSection_module_css_default.inputInvalid : YuyiSettingsSection_module_css_default.input,
								type: kind === "number" ? "number" : "text",
								value: draft,
								disabled: !editable,
								spellCheck: false,
								...invalid ? { "aria-invalid": true } : {},
								onChange: (event) => {
									setDrafts((current) => ({
										...current,
										[field]: event.target.value
									}));
								},
								onKeyDown: (event) => {
									if (event.key === "Enter") saveAll();
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: invalid ? YuyiSettingsSection_module_css_default.invalidHint : YuyiSettingsSection_module_css_default.hint,
								children: invalid ? t("field.invalidNumber") : t(`hint.${field}`)
							})
						]
					}, field);
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: YuyiSettingsSection_module_css_default.field,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: YuyiSettingsSection_module_css_default.fieldHead,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								className: YuyiSettingsSection_module_css_default.fieldLabel,
								htmlFor: "yuyi-token",
								children: t("field.token")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: YuyiSettingsSection_module_css_default.badges,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: tokenState?.configured === true ? YuyiSettingsSection_module_css_default.badge : YuyiSettingsSection_module_css_default.badgeMuted,
									children: tokenState === void 0 ? t("status.loading") : tokenState.configured ? t("token.configured") : t("token.missing")
								}), tokenState?.configured === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: YuyiSettingsSection_module_css_default.textButton,
									disabled: tokenState.writable === false,
									onClick: () => {
										clearToken();
									},
									children: t("action.clear")
								})]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							id: "yuyi-token",
							className: YuyiSettingsSection_module_css_default.input,
							type: "password",
							value: tokenDraft,
							disabled: !editable || tokenState?.writable === false,
							spellCheck: false,
							autoComplete: "off",
							onChange: (event) => {
								setTokenDraft(event.target.value);
							},
							onKeyDown: (event) => {
								if (event.key === "Enter") saveAll();
							}
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: YuyiSettingsSection_module_css_default.hint,
							children: t("token.hint")
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("footer", {
				className: YuyiSettingsSection_module_css_default.footer,
				children: [
					saveError !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: YuyiSettingsSection_module_css_default.failed,
						role: "alert",
						children: saveError
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: YuyiSettingsSection_module_css_default.discard,
						disabled: !editable || dirtyFields.length === 0 && !tokenDirty,
						onClick: discardAll,
						children: t("action.discard")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: YuyiSettingsSection_module_css_default.save,
						disabled: !canSave,
						onClick: () => {
							saveAll();
						},
						children: t("action.save")
					})
				]
			})
		]
	});
}

//#endregion
//#region src/client/index.ts
const inject = [
	"slots",
	"locale",
	"connection",
	"remote",
	"remote.credentials",
	"settingsScope"
];
/**

* 客户端插件主体：挂载 Remote 贡献，注册

* 字典，并注册活动面板、头部工具钮、协同卡片

* 与设置区块。

* @param ctx - 客户端根上下文。

*/
function apply(ctx) {
	ctx.effect(async () => {
		const dispose = await ctx.remote.$mount(remote_contribution_default);
		return () => {
			dispose();
		};
	}, "dsh-yuyi: remote contribution");
	ctx.effect(() => ctx.locale.register(NS, {
		zh,
		en
	}), "dsh-yuyi: panel dictionaries");
	ctx.effect(() => ctx.locale.register(NS$1, {
		zh: zh$1,
		en: en$1
	}), "dsh-yuyi: section dictionaries");
	const yuyiFace = () => {
		const face = ctx.get("remote.yuyi");
		if (face === void 0) throw new Error("yuyi remote namespace is not mounted yet");
		return face;
	};
	const readStatus = async () => unwrap(await yuyiFace().status());
	const readCollab = async () => unwrapCollab(await yuyiFace().collab());
	const readInbox = async (target, peek) => unwrap(await yuyiFace().inbox(target === "device" ? target : sessionIdKey(target), peek));
	const mirror = new YuyiStatusMirror(readStatus);
	ctx.effect(() => mirror.start(), "dsh-yuyi: status mirror");
	const collabMirror = new YuyiCollabMirror(readCollab);
	ctx.effect(() => collabMirror.start(), "dsh-yuyi: collab mirror");
	const onChange = (listener) => {
		const offStatus = mirror.subscribe(listener);
		const offCollab = collabMirror.subscribe(listener);
		return () => {
			offStatus();
			offCollab();
		};
	};
	const panelStore = createPanelStore();
	ctx.effect(() => mirror.subscribe(() => {
		const status = mirror.getSnapshot().current;
		if (status?.configured === true && !panelStore.hasUserChoice()) panelStore.open();
	}), "dsh-yuyi: panel auto-open");
	ctx.slots.inject("shell.overlay", () => ctx.slots.register({
		name: "shell.overlay",
		id: "yuyi-panel",
		order: 20,
		locale: NS,
		inject: () => ({
			readStatus,
			readCollab,
			readInbox,
			onChange,
			panel: panelStore
		})
	}, YuyiPanel));
	for (const [toolName, Card] of Object.entries(COLLAB_CARDS)) ctx.slots.inject("tool.call.toolview", () => ctx.slots.register({
		name: "tool.call.toolview",
		key: toolName,
		id: `yuyi-${toolName}`,
		locale: NS,
		inject: () => ({ panel: panelStore })
	}, Card));
	const scope = ctx.settingsScope.bind({ namespace: YUYI_SETTINGS_NAMESPACE });
	const credentials = ctx.remote.credentials;
	const tokenRef = () => scope.getSnapshot().value?.tokenEnv ?? "YUYI_TOKEN";
	const tokenStore = {
		async read() {
			const ref = tokenRef();
			const response = await credentials.describe([ref]);
			if (!response.ok) throw new Error(response.error.message ?? "credentials describe failed");
			return response.value[ref] ?? {
				configured: false,
				writable: true
			};
		},
		async save(value) {
			const response = await credentials.set(tokenRef(), value);
			if (!response.ok) throw new Error(response.error.message ?? "credentials set failed");
		},
		async clear() {
			const response = await credentials.unset(tokenRef());
			if (!response.ok) throw new Error(response.error.message ?? "credentials unset failed");
		},
		onChange(listener) {
			return ctx.remote.$on("credentials/reference-updated", (ref) => {
				if (String(ref) === tokenRef()) listener();
			});
		}
	};
	const sectionT = ctx.locale.bind(NS$1);
	ctx.slots.inject("settings.section", () => ctx.slots.register({
		name: "settings.section",
		id: "yuyi",
		order: 30,
		label: () => sectionT("nav"),
		locale: NS$1,
		inject: () => ({
			hooks: {
				settings: scope,
				status: mirror
			},
			save: (field, value) => scope.set(field, value),
			reset: (field) => scope.unset(field),
			token: tokenStore
		})
	}, YuyiSettingsSection));
}
function sessionIdKey(sessionId) {
	return String(sessionId);
}

//#endregion
exports.COLLAB_CARDS = COLLAB_CARDS;
exports.CONNECTION_FIELDS = CONNECTION_FIELDS;
exports.PANEL_NS = NS;
exports.YUYI_SETTINGS_NAMESPACE = YUYI_SETTINGS_NAMESPACE;
exports.YuyiCollabMirror = YuyiCollabMirror;
exports.YuyiPanel = YuyiPanel;
exports.YuyiSettingsSection = YuyiSettingsSection;
exports.YuyiStatusMirror = YuyiStatusMirror;
exports.apply = apply;
exports.connectionState = connectionState;
exports.createPanelStore = createPanelStore;
exports.dagLayout = dagLayout;
exports.draftValid = draftValid;
exports.draftWrite = draftWrite;
exports.fieldDraft = fieldDraft;
exports.inboxRows = inboxRows;
exports.inboxSender = inboxSender;
exports.inject = inject;
exports.interpolate = interpolate;
exports.panelEn = en;
exports.panelModel = panelModel;
exports.panelZh = zh;
exports.sectionEn = en$1;
exports.sectionZh = zh$1;
exports.taskStatusOf = taskStatusOf;
exports.unwrap = unwrap;
exports.unwrapCollab = unwrapCollab;
exports.upstreamOf = upstreamOf;
exports.userOverrides = userOverrides;
return module.exports; } });
//# sourceMappingURL=client.js.map