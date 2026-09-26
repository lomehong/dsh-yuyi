window.__ModuleLoader__.load({
	id: "dsh-yuyi",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function joinValues(array, separator = "|") {
			return array.map((val) => stringifyPrimitive(val)).join(separator);
		}
		function jsonStringifyReplacer(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		function cached(getter) {
			return { get value() {
				{
					const value = getter();
					Object.defineProperty(this, "value", { value });
					return value;
				}
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
			const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
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
		const allowsEval = /* @__PURE__*/ cached(() => {
			if (globalConfig.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
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
		const propertyKeyTypes = /* @__PURE__*/ new Set([
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
		function stringifyPrimitive(value) {
			if (typeof value === "bigint") return value.toString() + "n";
			if (typeof value === "string") return `"${value}"`;
			return `${value}`;
		}
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = /*@__PURE__*/ (() => ({
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		}))();
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key of Reflect.ownKeys(mask)) {
						if (!Object.prototype.hasOwnProperty.call(currDef.shape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
						if (!mask[key]) continue;
						assignProp(newShape, key, currDef.shape[key]);
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function omit(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = { ...schema._zod.def.shape };
					for (const key of Reflect.ownKeys(mask)) {
						if (!Object.prototype.hasOwnProperty.call(currDef.shape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
						if (!mask[key]) continue;
						delete newShape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function extend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = schema._zod.def.shape;
				for (const key of Reflect.ownKeys(shape)) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function safeExtend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function merge(a, b) {
			if (!b?._zod?.def) throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			return clone(a, mergeDefs(a._zod.def, {
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
			}));
		}
		function partial(Class, schema, mask, name = "partial") {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key of Reflect.ownKeys(mask)) {
						if (!Object.prototype.hasOwnProperty.call(oldShape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key of Reflect.ownKeys(oldShape)) shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
					assignProp(this, "shape", shape);
					return shape;
				},
				checks: []
			}));
		}
		function required(Class, schema, mask) {
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key of Reflect.ownKeys(mask)) {
					if (!Object.prototype.hasOwnProperty.call(shape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key of Reflect.ownKeys(oldShape)) shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
				assignProp(this, "shape", shape);
				return shape;
			} }));
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
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function attachSchema(issues, start, inst) {
			var _a;
			for (let i = start; i < issues.length; i++) (_a = issues[i]).schema ?? (_a.schema = inst);
		}
		function finalizeIssue(iss, ctx, config) {
			var _a;
			const traits = iss.inst?._zod?.traits;
			if (traits?.has("$ZodType")) {
				if (traits.has("$ZodCheck")) (_a = iss).schema ?? (_a.schema = iss.inst);
				else iss.schema = iss.inst;
			}
			const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, schema: _schema, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		const highSurrogate = /[\uD800-\uDBFF]/;
		function codePointLength(str) {
			const units = str.length;
			if (!highSurrogate.test(str)) return units;
			let count = units;
			for (let i = 0; i < units - 1; i++) if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
				count--;
				i++;
			}
			return count;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function parsedType(data) {
			const t = typeof data;
			switch (t) {
				case "number": return Number.isNaN(data) ? "nan" : "number";
				case "object": {
					if (data === null) return "null";
					if (Array.isArray(data)) return "array";
					const obj = data;
					if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) return obj.constructor.name;
				}
			}
			return t;
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
		/**
		* Installs a trait's members on its prototype. Each value builds that member for the instance on first read; the built value shadows the accessor as an own property, so a detached `const { parse } = schema` keeps working.
		*
		* Call this from a `proto` initializer, which runs once per prototype — never per instance.
		*/
		function members(proto, table) {
			for (const key in table) {
				const desc = Object.getOwnPropertyDescriptor(table, key);
				if (desc.get) Object.defineProperty(proto, key, {
					...desc,
					enumerable: false
				});
				else defineBound(proto, key, desc.value);
			}
		}
		/** Shadows a prototype member with an own value, so a getter that builds from the instance runs once. */
		function own(inst, key, value, enumerable = true) {
			Object.defineProperty(inst, key, {
				configurable: true,
				writable: true,
				enumerable,
				value
			});
			return value;
		}
		/** Like {@link own}, for a member that was never an own data property and has to stay out of `Object.keys`. */
		function hide(inst, key, value) {
			return own(inst, key, value, false);
		}
		function defineBound(proto, key, fn) {
			Object.defineProperty(proto, key, {
				configurable: true,
				get() {
					return this == null ? fn : own(this, key, fn.bind(this));
				},
				set(value) {
					own(this, key, value);
				}
			});
		}
		/** Returns the prototype to install on, or `undefined` if this group is already installed on it. */
		function claim(inst, sentinel) {
			const proto = Object.getPrototypeOf(inst);
			return sentinel in proto ? void 0 : proto;
		}
		let installing;
		let broke = false;
		const breaker = {
			configurable: true,
			get() {
				broke = true;
			}
		};
		/**
		* Installs a lazily-derived internal on the `_zod` prototype of `inst`'s
		* constructor, computed from the internals object itself and cached there on
		* first read. One accessor per constructor rather than one per instance.
		*/
		function defineLazyInternal(inst, key, compute) {
			const proto = Object.getPrototypeOf(inst._zod);
			if (key in proto && installing !== inst._zod) {
				installing = void 0;
				return;
			}
			installing = inst._zod;
			Object.defineProperty(proto, key, {
				configurable: true,
				get() {
					Object.defineProperty(this, key, breaker);
					const outer = broke;
					broke = false;
					try {
						const value = compute(this);
						if (broke) delete this[key];
						else Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							value
						});
						broke = broke || outer;
						return value;
					} catch (err) {
						delete this[key];
						broke = broke || outer;
						throw err;
					}
				},
				set(value) {
					Object.defineProperty(this, key, {
						configurable: true,
						writable: true,
						value
					});
				}
			});
		}
		/**
		* Installs `key` on `inst`'s prototype, computed by `make` on first read and cached there as an own
		* data property. One accessor per constructor rather than one per instance, because an own accessor
		* puts every instance after the first into v8 dictionary mode. The key doubles as the sentinel.
		*/
		function installLazyProp(inst, key, make, enumerable) {
			const proto = claim(inst, key);
			if (!proto) return;
			Object.defineProperty(proto, key, {
				configurable: true,
				get() {
					const desc = {
						configurable: true,
						writable: true,
						enumerable,
						value: void 0
					};
					Object.defineProperty(this, key, desc);
					desc.value = make(this);
					Object.defineProperty(this, key, desc);
					return desc.value;
				},
				set(value) {
					Object.defineProperty(this, key, {
						configurable: true,
						writable: true,
						enumerable,
						value
					});
				}
			});
		}
		/** Marks the thunk `_catch` synthesises for a constant catch value. `Function.length` cannot tell that thunk from a user callback — rest and defaulted parameters both report arity 0 — and a user callback reads `ctx.error`, whose issues only finalize correctly against the caller's per-parse error map. Provenance can say what arity cannot. A plain string key rather than `Symbol.for`, whose call at module scope no bundler can prove pure — the same shape that anchored `urlCanParse` into every build. */
		const CONSTANT_CATCH = "~constantCatch";
		/** Wraps a constant catch value in a thunk tagged with {@link CONSTANT_CATCH}. */
		function constantCatch(value) {
			const fn = () => value;
			fn[CONSTANT_CATCH] = true;
			return fn;
		}
		//#endregion
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/core.js
		var _a$1;
		const _zodDesc$1 = {
			value: void 0,
			enumerable: false
		};
		let _E = "captureStackTrace" in Error ? Error : null;
		function newError(Definition) {
			const E = _E;
			if (E) {
				const saved = E.stackTraceLimit;
				if (typeof saved === "number") {
					try {
						E.stackTraceLimit = 0;
					} catch {
						_E = null;
						return new Definition();
					}
					try {
						return new Definition();
					} finally {
						E.stackTraceLimit = saved;
					}
				}
			}
			return new Definition();
		}
		function $constructor(name, initializer, proto, params) {
			const zodProto = {};
			function Internals(def) {
				this.def = def;
				this.constr = _;
				this.traits = /* @__PURE__ */ new Set();
			}
			Internals.prototype = zodProto;
			const protoMembers = proto;
			const initialized = protoMembers && /* @__PURE__ */ new WeakSet();
			function init(inst, def) {
				if (!inst._zod) {
					_zodDesc$1.value = new Internals(def);
					try {
						Object.defineProperty(inst, "_zod", _zodDesc$1);
					} finally {
						_zodDesc$1.value = void 0;
					}
				}
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				if (initialized) {
					const own = Object.getPrototypeOf(inst);
					const ctorProto = inst._zod.constr.prototype;
					let up = own;
					while (up && up !== ctorProto) up = Object.getPrototypeOf(up);
					const target = up ?? own;
					if (!initialized.has(target)) {
						initialized.add(target);
						members(target, protoMembers);
					}
				}
				const proto = _.prototype;
				for (const k in proto) {
					if (!Object.prototype.hasOwnProperty.call(proto, k)) continue;
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				const inst = params?.Parent ? newError(Definition) : this;
				init(inst, def);
				const deferred = inst._zod.deferred;
				if (deferred) {
					for (const fn of deferred) fn();
					inst._zod.deferred = void 0;
				}
				const pp = globalThis.__zod_globalConfig?.postProcessor;
				if (pp) pp(inst);
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
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/errors.js
		function _getMessage() {
			const internals = this._zod;
			internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
			return internals.message;
		}
		function _setMessage(value) {
			this._zod.message = value;
		}
		const _messageDesc = {
			get: _getMessage,
			set: _setMessage,
			enumerable: true,
			configurable: true
		};
		const _zodDesc = {
			value: void 0,
			enumerable: false
		};
		const _issuesDesc = {
			value: void 0,
			enumerable: false
		};
		const _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			_zodDesc.value = inst._zod;
			Object.defineProperty(inst, "_zod", _zodDesc);
			_issuesDesc.value = def;
			Object.defineProperty(inst, "issues", _issuesDesc);
			_zodDesc.value = void 0;
			_issuesDesc.value = void 0;
			Object.defineProperty(inst, "message", _messageDesc);
			const proto = Object.getPrototypeOf(inst);
			if (!_installedToString.has(proto)) {
				_installedToString.add(proto);
				Object.defineProperty(proto, "toString", {
					configurable: true,
					enumerable: false,
					get() {
						const value = () => this.message;
						Object.defineProperty(this, "toString", {
							value,
							configurable: true,
							writable: true
						});
						return value;
					},
					set(value) {
						Object.defineProperty(this, "toString", {
							value,
							configurable: true,
							writable: true
						});
					}
				});
			}
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, void 0, { Parent: Error });
		/** Get-or-create `obj[key]` as an own data property. A path segment naming an inherited member
		* ("toString", "constructor") would otherwise read through to the prototype, and assigning
		* "__proto__" would hit the setter instead of creating a key. */
		function node(obj, key, make) {
			if (!Object.prototype.hasOwnProperty.call(obj, key)) {
				if (key === "__proto__") Object.defineProperty(obj, key, {
					value: make(),
					writable: true,
					enumerable: true,
					configurable: true
				});
				else obj[key] = make();
			}
			return obj[key];
		}
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
			else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							const terminal = i === fullpath.length - 1;
							if (el === "_errors") {
								if (terminal) curr._errors.push(mapper(issue));
								i++;
								continue;
							}
							if (!Object.prototype.hasOwnProperty.call(curr, el)) Object.defineProperty(curr, el, {
								value: { _errors: [] },
								enumerable: true,
								writable: true,
								configurable: true
							});
							const node = curr[el];
							if (terminal) node._errors.push(mapper(issue));
							curr = node;
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/parse.js
		function finalizeParams(callee, params) {
			return {
				callee: params?.callee ?? callee,
				Err: params?.Err
			};
		}
		const _parse = (_Err) => {
			const fn = (schema, value, _ctx, _params) => {
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
					const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
					captureStackTrace(e, _params?.callee ?? fn);
					throw e;
				}
				return result.value;
			};
			return fn;
		};
		const _parseAsync = (_Err) => {
			const fn = async (schema, value, _ctx, params) => {
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
					const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
					captureStackTrace(e, params?.callee ?? fn);
					throw e;
				}
				return result.value;
			};
			return fn;
		};
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
		const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
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
		const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
		const _encode = (_Err) => {
			const parse = _parse(_Err);
			const fn = (schema, value, _ctx, _params) => {
				const ctx = _ctx ? {
					..._ctx,
					direction: "backward"
				} : { direction: "backward" };
				return parse(schema, value, ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _decode = (_Err) => {
			const parse = _parse(_Err);
			const fn = (schema, value, _ctx, _params) => {
				return parse(schema, value, _ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _encodeAsync = (_Err) => {
			const parseAsync = _parseAsync(_Err);
			const fn = async (schema, value, _ctx, _params) => {
				const ctx = _ctx ? {
					..._ctx,
					direction: "backward"
				} : { direction: "backward" };
				return await parseAsync(schema, value, ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _decodeAsync = (_Err) => {
			const parseAsync = _parseAsync(_Err);
			const fn = async (schema, value, _ctx, _params) => {
				return await parseAsync(schema, value, _ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _safeEncode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse(_Err)(schema, value, ctx);
		};
		const _safeDecode = (_Err) => (schema, value, _ctx) => {
			return _safeParse(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		function nanoidOfLength(length) {
			return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
		}
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$1 = `^[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		/** Anchors a pattern source. The interpolation lives here rather than at the call site because
		* esbuild will not drop a `@__PURE__` call whose own argument interpolates a variable, but it
		* will drop `anchor(dateSource)`. Keeping it inline pinned `date` into every bundle. */
		function anchor(source) {
			return new RegExp(`^${source}$`);
		}
		const date = /*@__PURE__*/ anchor(dateSource);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime(args) {
			const opts = ["Z"];
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const qualified = `${timeSource({
				precision: args.precision,
				seconds: true
			})}(?:${opts.join("|")})`;
			const timeRegex = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
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
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		/** Default `when` for length-based checks: run only on non-nullish values with a `length`. */
		const _whenHasLength = (payload) => {
			const val = payload.value;
			return !nullish(val) && val.length !== void 0;
		};
		const numericOriginMap = {
			number: "number",
			bigint: "bigint",
			object: "date"
		};
		const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
				if (def.value < curr) {
					if (def.inclusive) bag.maximum = def.value;
					else bag.exclusiveMaximum = def.value;
				}
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin: numericOriginMap[typeof payload.value] ?? origin,
					code: "too_big",
					maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
				if (def.value > curr) {
					if (def.inclusive) bag.minimum = def.value;
					else bag.exclusiveMinimum = def.value;
				}
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin: numericOriginMap[typeof payload.value] ?? origin,
					code: "too_small",
					minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				var _a;
				(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
			});
			inst._zod.check = (payload) => {
				if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
				if (typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
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
		const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
			$ZodCheck.init(inst, def);
			def.format = def.format || "float64";
			const isInt = def.format?.includes("int");
			const origin = isInt ? "int" : "number";
			const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
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
		const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const units = input.length;
				if ((typeof input === "string" && units > def.maximum ? codePointLength(input) : units) <= def.maximum) return;
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
		const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const units = input.length;
				if ((typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units) >= def.minimum) return;
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
		const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const units = input.length;
				const length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
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
		const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				if (def.pattern) {
					bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
					bag.patterns.add(def.pattern);
				}
			});
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
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
		const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
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
		const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck.init(inst, def);
			const escapedRegex = escapeRegex(def.includes);
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
			def.pattern = pattern;
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
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
		const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
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
		const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
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
		const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = [], closed = {}) {
				this.content = [];
				this.indent = 0;
				this.args = args;
				this.closed = closed;
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
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const content = this?.content ?? [``];
				return new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${content.join("\n")}\n};`)(...Object.values(this.closed));
			}
		};
		//#endregion
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 5,
			patch: 4
		};
		//#endregion
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const defChecks = inst._zod.def.checks;
			const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					if (payload.memo) return payload;
					let isAborted = aborted(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							attachSchema(payload.issues, currLen, inst);
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							attachSchema(payload.issues, currLen, inst);
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
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
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
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
		}, {
			get "~standard"() {
				return hide(this, "~standard", standardProps(this));
			},
			set "~standard"(value) {
				own(this, "~standard", value);
			}
		});
		/** The Standard Schema surface for `inst`. Shared so wrappers can extend it without forcing it. */
		const toStandardResult = (r) => r.success ? { value: r.data } : { issues: r.error?.issues };
		function standardProps(inst) {
			return {
				validate: (value) => {
					try {
						return toStandardResult(safeParse$1(inst, value));
					} catch (_) {
						return safeParseAsync$1(inst, value).then(toStandardResult);
					}
				},
				vendor: "zod",
				version: 1
			};
		}
		const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
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
		const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			$ZodString.init(inst, def);
		});
		const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid(v));
			} else def.pattern ?? (def.pattern = uuid());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email);
			$ZodStringFormat.init(inst, def);
		});
		/** Parses a URL for `$ZodURL`, applying the one guard the URL constructor cannot express. Returns the parsed URL, or a code naming the stage that rejected it — the runtime needs that distinction to pick an issue note, and compiled code only needs to know it is not a URL. */
		function parseURLObject(trimmed, def) {
			if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) return 1;
			try {
				return new URL(trimmed);
			} catch {
				return 2;
			}
		}
		const asciiTabOrNewline = /[\t\n\r]/g;
		/** The URL parser deletes every ASCII tab, LF and CR from its input before it parses, so `new URL("https://exa\nmple.com")` reports on `example.com`. Applying the same deletion to the returned value closes the half of that divergence which can move the host; the parser's other rewrite, stripping C0 controls at the edges, cannot. */
		function stripTabAndNewline(value) {
			return value.replace(asciiTabOrNewline, "");
		}
		function urlHostnameOk(url, hostname) {
			hostname.lastIndex = 0;
			return hostname.test(url.hostname);
		}
		function urlProtocolOk(url, protocol) {
			protocol.lastIndex = 0;
			return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
		}
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					const url = parseURLObject(trimmed, def);
					if (url === 1) {
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
					if (url === 2) {
						payload.issues.push({
							code: "invalid_format",
							format: "url",
							input: payload.value,
							inst,
							continue: !def.abort
						});
						return;
					}
					if (def.hostname && !urlHostnameOk(url, def.hostname)) payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid hostname",
						pattern: def.hostname.source,
						input: payload.value,
						inst,
						continue: !def.abort
					});
					if (def.protocol && !urlProtocolOk(url, def.protocol)) payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid protocol",
						pattern: def.protocol.source,
						input: payload.value,
						inst,
						continue: !def.abort
					});
					payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
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
		const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
			if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1)) throw new Error(`Invalid nanoid length: ${def.length}`);
			def.pattern ?? (def.pattern = def.length === void 0 ? nanoid : nanoidOfLength(def.length));
			$ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime(def));
			$ZodStringFormat.init(inst, def);
			if (def.local || def.precision === -1) {
				inst._zod.bag.laxFormat = true;
				inst._zod.onattach.push((s) => {
					s._zod.bag.laxFormat = true;
				});
			}
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		/** An IPv6 address is written with hex digits, colons and dots, and nothing else. The guard is what makes the check below an IPv6 check: `new URL("http://[...]")` parses an authority, not an address, so `@` and `\` re-delimit it and `"::@1\\"` validates against the host `0.0.0.1`. The URL parser also deletes ASCII tab, LF and CR rather than failing, which is how `"::1\n"` validated as `::1`. */
		const ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
		function isValidIPv6(value) {
			if (!ipv6Alphabet.test(value)) return false;
			try {
				new URL(`http://[${value}]`);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				if (!isValidIPv6(payload.value)) payload.issues.push({
					code: "invalid_format",
					format: "ipv6",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		function isValidCIDRv6(value) {
			const parts = value.split("/");
			if (parts.length !== 2) return false;
			const [address, prefix] = parts;
			if (!prefix) return false;
			const prefixNum = Number(prefix);
			if (`${prefixNum}` !== prefix) return false;
			if (prefixNum < 0 || prefixNum > 128) return false;
			return isValidIPv6(address);
		}
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (!isValidCIDRv6(payload.value)) payload.issues.push({
					code: "invalid_format",
					format: "cidrv6",
					input: payload.value,
					inst,
					continue: !def.abort
				});
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
		const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
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
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
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
		const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
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
		const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
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
		const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Number(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
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
		const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
			$ZodCheckNumberFormat.init(inst, def);
			$ZodNumber.init(inst, def);
		});
		const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
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
		const $ZodUndefined = /*@__PURE__*/ $constructor("$ZodUndefined", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = _undefined$2;
			inst._zod.values = /* @__PURE__ */ new Set([void 0]);
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
		const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
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
		const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
			$ZodType.init(inst, def);
			const memo = globalConfig.memoizer;
			memo?.attach(inst);
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
				payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
				const proms = [];
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
					else handleArrayResult(result, payload, i);
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult(result, final, key, input, optin, optout) {
			const isPresent = key in input;
			const isOptionalOut = optout === "optional";
			if (!isPresent && isOptionalOut && optin === "optional") return;
			if (result.issues.length) {
				if (optin !== void 0 && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && optin === void 0) {
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
		const NO_SYMBOL_KEYS = [];
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			const ownSymbols = Object.getOwnPropertySymbols(def.shape);
			const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
			const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
			for (const k of allKeys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				allKeys,
				symbolKeys,
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
			const optin = _catchall.optin;
			const optout = _catchall.optout;
			for (const key in input) {
				if (keySet.has(key)) continue;
				if (key === "__proto__") {
					if (t === "never") unrecognized.push(key);
					continue;
				}
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
				else handlePropertyResult(r, payload, key, input, optin, optout);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst,
				continue: true
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const propShapes = /* @__PURE__ */ new WeakMap();
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				propShapes.set(def, sh);
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					propShapes.set(def, newSh);
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazyInternal(inst, "propValues", (zod) => {
				const shape = zod.def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						if (!Object.prototype.hasOwnProperty.call(propValues, key)) assignProp(propValues, key, /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
						if (field.optin !== void 0) propValues[key].add(void 0);
					}
				}
				return propValues;
			});
			const isObject$1 = isObject;
			const catchall = def.catchall;
			let value;
			const memo = globalConfig.memoizer;
			memo?.attach(inst);
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
				payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.allKeys) {
					if (key === "__proto__") continue;
					const el = shape[key];
					const optin = el._zod.optin;
					const optout = el._zod.optout;
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
					else handlePropertyResult(r, payload, key, input, optin, optout);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const memo = globalConfig.memoizer;
			const generateFastpass = (shape) => {
				const normalized = _normalized.value;
				const syms = normalized.symbolKeys;
				const doc = new Doc(["payload", "ctx"], {
					shape,
					inst,
					memo,
					syms
				});
				const parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				const prefixStr = (id, k) => `
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
          }`;
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.allKeys) ids[key] = `key_${counter++}`;
				doc.write(memo ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
				for (const key of normalized.allKeys) {
					if (key === "__proto__") continue;
					const id = ids[key];
					const k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key);
					const isPresent = `${k} in input`;
					const schema = shape[key];
					const optin = schema?._zod?.optin;
					const isOptionalIn = optin !== void 0;
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(k)};`);
					if (isOptionalIn && isOptionalOut) {
						const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
						doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					} else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
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
          newResult[${k}] = ${id}.value;
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        
        if (${id}.value === undefined) {
          if (${isPresent}) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }

      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				return doc.compile();
			};
			let fastpass;
			const isObject$2 = isObject;
			const jit = !globalConfig.jitless;
			const fastEnabled = jit && allowsEval.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$2(input)) {
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
		const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0);
			defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazyInternal(inst, "values", (zod) => {
				if (zod.def.options.every((o) => o._zod.values)) return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazyInternal(inst, "pattern", (zod) => {
				if (zod.def.options.every((o) => o._zod.pattern)) {
					const patterns = zod.def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
				}
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
				return Promise.all(results).then((results) => {
					return handleUnionResults(results, payload, inst, ctx);
				});
			};
		});
		const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
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
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults(payload, left, right);
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
				if (Object.prototype.hasOwnProperty.call(newObj, "__proto__")) delete newObj.__proto__;
				for (const key of sharedKeys) {
					if (key === "__proto__") continue;
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
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			const keyIssues = /* @__PURE__ */ new Map();
			const collect = (iss, side) => {
				let keys;
				if (iss.code === "unrecognized_keys" && !iss.path?.length) {
					unrecIssue ?? (unrecIssue = iss);
					keys = iss.keys;
				} else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
					const k = String(iss.path[0]);
					if (!keyIssues.has(k)) keyIssues.set(k, iss);
					keys = [k];
				} else return false;
				for (const k of keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k)[side] = true;
				}
				return true;
			};
			for (const iss of left.issues) if (!collect(iss, "l")) result.issues.push(iss);
			for (const iss of right.issues) if (!collect(iss, "r")) result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length) {
				const aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
				if (aggregated.length) result.issues.push({
					...unrecIssue,
					keys: aggregated
				});
				for (const k of bothKeys) if (!aggregated.includes(k) && keyIssues.has(k)) result.issues.push(keyIssues.get(k));
			}
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) {
				if (aborted(result)) return result;
				throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			}
			result.value = merged.data;
			return result;
		}
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			const patternValues = values.filter((k) => propertyKeyTypes.has(typeof k));
			inst._zod.pattern = new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
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
		const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
			$ZodType.init(inst, def);
			const values = new Set(def.values);
			inst._zod.values = values;
			inst._zod.pattern = new RegExp(def.values.length ? `^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
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
		const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			globalConfig.memoizer?.guard(inst);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				return payload;
			};
		});
		function handleOptionalResult(payload, result) {
			payload.value = result.issues.length ? void 0 : result.value;
			return payload;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
			inst._zod.optout = "optional";
			defineLazyInternal(inst, "values", (zod) => {
				const values = zod.def.innerType._zod.values;
				return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
			});
			defineLazyInternal(inst, "pattern", (zod) => {
				const pattern = zod.def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === void 0) {
					if (def.innerType._zod.optin !== "defaulted") return payload;
					const result = def.innerType._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) return result.then((result) => handleOptionalResult(payload, result));
					return handleOptionalResult(payload, result);
				}
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
			defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
			defineLazyInternal(inst, "pattern", (zod) => {
				const pattern = zod.def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazyInternal(inst, "values", (zod) => {
				return zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "defaulted";
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
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
				if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
				return handleDefaultResult(result, def);
			};
		});
		function handleDefaultResult(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "defaulted";
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "values", (zod) => {
				const v = zod.def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
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
		function handleCatchResult(payload, result, def, ctx) {
			if (!result.issues.length) {
				payload.value = result.value;
				if (result.memo) payload.memo = true;
				return payload;
			}
			payload.value = def.catchValue({
				...result,
				value: payload.value,
				error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
				input: payload.value
			});
			return payload;
		}
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
			defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run({
					value: payload.value,
					issues: []
				}, ctx);
				if (result instanceof Promise) return result.then((result) => handleCatchResult(payload, result, def, ctx));
				return handleCatchResult(payload, result, def, ctx);
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
			defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
			defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
			defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
					return handlePipeResult(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
				return handlePipeResult(left, def.out, ctx);
			};
		});
		function handlePipeResult(left, next, ctx) {
			if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
			defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			if (!payload.memo) payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
			$ZodCheck.init(inst, def);
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
				handleRefineResult(r, payload, input, inst);
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
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/memoizer.js
		var $ZodCyclicError = class extends Error {
			constructor() {
				super(`Cannot parse a reference cycle that closes through a transform`);
				this.name = "ZodCyclicError";
			}
		};
		/** Keyed off the context object every schema in one parse call already shares. */
		const STATE = "~memo";
		const NO_ISSUES = [];
		function cloneIssues(issues) {
			return issues.map((iss) => iss.path ? {
				...iss,
				path: iss.path.slice()
			} : { ...iss });
		}
		const recursive = /*@__PURE__*/ new WeakMap();
		/** Whether this schema's subtree contains a cycle, so one parse can re-enter it. */
		function isRecursive(inst, stack) {
			const cached = recursive.get(inst);
			if (cached !== void 0) return cached;
			if (stack.has(inst)) return true;
			stack.add(inst);
			let result = false;
			const check = (child) => {
				if (!result && child?._zod && isRecursive(child, stack)) result = true;
			};
			const def = inst._zod.def;
			switch (def.type) {
				case "object":
					for (const key of Reflect.ownKeys(def.shape)) check(def.shape[key]);
					check(def.catchall);
					break;
				case "array":
					check(def.element);
					break;
				case "tuple":
					for (const el of def.items) check(el);
					check(def.rest);
					break;
				case "record":
				case "map":
					check(def.keyType);
					check(def.valueType);
					break;
				case "set":
					check(def.valueType);
					break;
				case "union":
					for (const el of def.options) check(el);
					break;
				case "intersection":
					check(def.left);
					check(def.right);
					break;
				case "optional":
				case "nullable":
				case "default":
				case "prefault":
				case "catch":
				case "readonly":
				case "nonoptional":
				case "promise":
				case "success":
					check(def.innerType);
					break;
				case "pipe":
					check(def.in);
					check(def.out);
					break;
				case "function":
					check(def.input);
					check(def.output);
					break;
				case "lazy":
					check(inst._zod.innerType);
					break;
				case "template_literal":
				case "string":
				case "number":
				case "int":
				case "boolean":
				case "bigint":
				case "symbol":
				case "undefined":
				case "null":
				case "void":
				case "never":
				case "any":
				case "unknown":
				case "date":
				case "nan":
				case "enum":
				case "literal":
				case "file":
				case "transform":
				case "custom": break;
				default: for (const key in def) {
					const desc = Object.getOwnPropertyDescriptor(def, key);
					if (!desc || desc.get) continue;
					const value = desc.value;
					if (!value || typeof value !== "object") continue;
					if (value._zod) check(value);
					else if (Array.isArray(value)) for (const el of value) check(el);
				}
			}
			stack.delete(inst);
			recursive.set(inst, result);
			return result;
		}
		function bucketFor(state, inst) {
			let bucket = state.buckets.get(inst);
			if (!bucket) {
				bucket = /* @__PURE__ */ new Map();
				state.buckets.set(inst, bucket);
			}
			return bucket;
		}
		let handoff;
		const open = [];
		const memo = {
			alloc(_inst, payload, empty) {
				const bucket = handoff;
				if (!bucket) return empty;
				handoff = void 0;
				const entry = {
					value: empty,
					issues: null
				};
				bucket.set(payload.value, entry);
				open.push(entry);
				return empty;
			},
			guard(inst) {
				var _a;
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred.push(() => {
					const base = inst._zod.parse;
					const wrapped = (payload, ctx) => {
						if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value)) throw new $ZodCyclicError();
						return base(payload, ctx);
					};
					inst._zod.parse = wrapped;
					if (inst._zod.run === base) inst._zod.run = wrapped;
				});
			},
			attach(inst) {
				var _a;
				let isRecursiveInst;
				let lastCtx;
				let lastBucket;
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred.push(() => {
					const base = inst._zod.parse;
					const wrapped = (payload, ctx) => {
						if (isRecursiveInst === void 0) {
							isRecursiveInst = isRecursive(inst, /* @__PURE__ */ new Set());
							if (!isRecursiveInst) {
								inst._zod.parse = base;
								if (inst._zod.run === wrapped) inst._zod.run = base;
								return base(payload, ctx);
							}
						}
						const input = payload.value;
						if (input === null || typeof input !== "object") return base(payload, ctx);
						let state = ctx[STATE];
						if (!state) {
							state = {
								buckets: /* @__PURE__ */ new Map(),
								backEdges: void 0
							};
							ctx[STATE] = state;
						}
						let bucket;
						if (lastCtx === ctx) bucket = lastBucket;
						else {
							bucket = bucketFor(state, inst);
							lastCtx = ctx;
							lastBucket = bucket;
						}
						const hit = bucket.get(input);
						if (hit) {
							payload.value = hit.value;
							if (hit.issues) {
								if (hit.issues.length) payload.issues.push(...cloneIssues(hit.issues));
							} else {
								payload.memo = true;
								state.backEdges ?? (state.backEdges = /* @__PURE__ */ new Set());
								state.backEdges.add(hit.value);
							}
							return payload;
						}
						handoff = bucket;
						const depth = open.length;
						const result = base(payload, ctx);
						handoff = void 0;
						const entry = open.length > depth ? open.pop() : void 0;
						if (result instanceof Promise) return result.then((r) => {
							if (entry) entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
							return r;
						});
						if (entry) entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
						return result;
					};
					inst._zod.parse = wrapped;
					if (inst._zod.run === base) inst._zod.run = wrapped;
				});
			}
		};
		/** The memoizer that gives containers cycle support. `zod` installs it by default; `zod/mini` opts in with `config({ memoizer: memoizer() })`. */
		function memoizer() {
			return memo;
		}
		/** Whether this value is a node a back-edge resolved to before it finished. */
		function isBackEdge(ctx, value) {
			const backEdges = ctx[STATE]?.backEdges;
			return backEdges !== void 0 && value !== null && typeof value === "object" && backEdges.has(value);
		}
		//#endregion
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/locales/en.js
		const error = () => {
			const Sizable = {
				string: {
					unit: "characters",
					verb: "to have"
				},
				file: {
					unit: "bytes",
					verb: "to have"
				},
				array: {
					unit: "items",
					verb: "to have"
				},
				set: {
					unit: "items",
					verb: "to have"
				},
				map: {
					unit: "entries",
					verb: "to have"
				}
			};
			function getSizing(origin) {
				return Sizable[origin] ?? null;
			}
			const FormatDictionary = {
				regex: "input",
				email: "email address",
				url: "URL",
				emoji: "emoji",
				uuid: "UUID",
				uuidv4: "UUIDv4",
				uuidv6: "UUIDv6",
				nanoid: "nanoid",
				guid: "GUID",
				cuid: "cuid",
				cuid2: "cuid2",
				ulid: "ULID",
				xid: "XID",
				ksuid: "KSUID",
				datetime: "ISO datetime",
				date: "ISO date",
				time: "ISO time",
				duration: "ISO duration",
				ipv4: "IPv4 address",
				ipv6: "IPv6 address",
				mac: "MAC address",
				cidrv4: "IPv4 range",
				cidrv6: "IPv6 range",
				base64: "base64-encoded string",
				base64url: "base64url-encoded string",
				json_string: "JSON string",
				e164: "E.164 number",
				credit_card: "credit card number",
				jwt: "JWT",
				template_literal: "input"
			};
			const TypeDictionary = { nan: "NaN" };
			function getTypeName(type, input) {
				if (type === "number" && typeof input === "number" && !Number.isFinite(input)) return String(input);
				return TypeDictionary[type] ?? type;
			}
			return (issue) => {
				switch (issue.code) {
					case "invalid_type": return `Invalid input: expected ${getTypeName(issue.expected)}, received ${getTypeName(parsedType(issue.input), issue.input)}`;
					case "invalid_value":
						if (issue.values.length === 1) return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
						return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
					case "too_big": {
						const adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<";
						const sizing = getSizing(issue.origin);
						if (sizing) return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
						return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
					}
					case "too_small": {
						const adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">";
						const sizing = getSizing(issue.origin);
						if (sizing) return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
						return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
					}
					case "invalid_format": {
						const _issue = issue;
						if (_issue.format === "starts_with") return `Invalid string: must start with "${_issue.prefix}"`;
						if (_issue.format === "ends_with") return `Invalid string: must end with "${_issue.suffix}"`;
						if (_issue.format === "includes") return `Invalid string: must include "${_issue.includes}"`;
						if (_issue.format === "regex") return `Invalid string: must match pattern ${_issue.pattern}`;
						return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
					}
					case "not_multiple_of": return `Invalid number: must be a multiple of ${issue.divisor}`;
					case "unrecognized_keys": return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
					case "invalid_key": return `Invalid key in ${issue.origin}`;
					case "invalid_union":
						if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `Invalid discriminator value. Expected ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
						if (issue.inclusive === false) return "Invalid input: more than one option matched";
						return "Invalid input";
					case "invalid_element": return `Invalid value in ${issue.origin}`;
					default: return `Invalid input`;
				}
			};
		};
		function en_default() {
			return { localeError: error() };
		}
		//#endregion
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/registries.js
		var _a;
		var $ZodRegistry = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
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
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/api.js
		// @__NO_SIDE_EFFECTS__
		function _string(Class, params) {
			return new Class({
				type: "string",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _email(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
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
		// @__NO_SIDE_EFFECTS__
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
		// @__NO_SIDE_EFFECTS__
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
		// @__NO_SIDE_EFFECTS__
		function _url(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
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
		// @__NO_SIDE_EFFECTS__
		function _cuid(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
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
		// @__NO_SIDE_EFFECTS__
		function _isoDate(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _number(Class, params) {
			return new Class({
				type: "number",
				checks: [],
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _int(Class, params) {
			return new Class({
				type: "number",
				check: "number_format",
				abort: false,
				format: "safeint",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _boolean(Class, params) {
			return new Class({
				type: "boolean",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _undefined$1(Class, params) {
			return new Class({
				type: "undefined",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lt(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lte(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gt(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gte(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _multipleOf(value, params) {
			return new $ZodCheckMultipleOf({
				check: "multiple_of",
				...normalizeParams(params),
				value
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength(maximum, params) {
			return new $ZodCheckMaxLength({
				check: "max_length",
				...normalizeParams(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength(minimum, params) {
			return new $ZodCheckMinLength({
				check: "min_length",
				...normalizeParams(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length(length, params) {
			return new $ZodCheckLengthEquals({
				check: "length_equals",
				...normalizeParams(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex(pattern, params) {
			return new $ZodCheckRegex({
				check: "string_format",
				format: "regex",
				...normalizeParams(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase(params) {
			return new $ZodCheckLowerCase({
				check: "string_format",
				format: "lowercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase(params) {
			return new $ZodCheckUpperCase({
				check: "string_format",
				format: "uppercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes(includes, params) {
			return new $ZodCheckIncludes({
				check: "string_format",
				format: "includes",
				...normalizeParams(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith(prefix, params) {
			return new $ZodCheckStartsWith({
				check: "string_format",
				format: "starts_with",
				...normalizeParams(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith(suffix, params) {
			return new $ZodCheckEndsWith({
				check: "string_format",
				format: "ends_with",
				...normalizeParams(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite(tx) {
			return new $ZodCheckOverwrite({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize(form) {
			return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim() {
			return /* @__PURE__ */ _overwrite((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify() {
			return /* @__PURE__ */ _overwrite((input) => slugify(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine(fn, params) {
			const ch = /* @__PURE__ */ _check((payload) => {
				payload.addIssue = (issue$2) => {
					if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
					else {
						const _issue = issue$2;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						if (!("input" in _issue)) _issue.input = payload.value;
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check(fn, params) {
			const ch = new $ZodCheck({
				check: "custom",
				...normalizeParams(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/to-json-schema.js
		function assignProps(target, ...sources) {
			for (const source of sources) for (const key of Reflect.ownKeys(source)) if (Object.prototype.propertyIsEnumerable.call(source, key)) assignProp(target, key, source[key]);
			return target;
		}
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
				seen: /* @__PURE__ */ new Map(),
				sharedDefsExtractedFor: void 0,
				sharedEmitDoneFor: void 0,
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				intersections: [],
				deferred: [],
				external: params?.external ?? void 0
			};
		}
		/**
		* Applies the `unrepresentable` setting at a site that has no JSON Schema equivalent. Throws
		* `message` unless the setting (or the handler's return value) says otherwise. Returns `true` if a
		* custom JSON Schema was written into `json`, in which case the caller must not write its own.
		*/
		function handleUnrepresentable(schema, ctx, json, params, message) {
			const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({
				zodSchema: schema,
				path: params.path,
				message
			}) : ctx.unrepresentable;
			if (result === "any") return false;
			if (result === void 0 || result === "throw") throw new Error(message);
			Object.assign(json, result);
			return true;
		}
		function process(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			ctx.sharedDefsExtractedFor = void 0;
			ctx.sharedEmitDoneFor = void 0;
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
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) assignProps(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function encodeJSONPointerSegment(segment) {
			return segment.replace(/~/g, "~0").replace(/\//g, "~1");
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external) return;
			const idToSchema = /* @__PURE__ */ new Map();
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
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}`
					};
				}
				const uriPrefix = `#`;
				const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
				if (entry[1] === root && !entry[1].schema.id) return { ref: uriPrefix };
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + encodeJSONPointerSegment(defId)
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
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
				if (ctx.metadataRegistry.get(entry[0])?.id) {
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
			if (ctx.external) ctx.sharedDefsExtractedFor = ctx.external;
		}
		/** Rewrites `anyOf: [{type: "a"}, {type: "b"}]` to `type: ["a", "b"]`, which every JSON Schema draft treats as equivalent and most consumers render far better for the nullable case. Only branches that are a bare type assertion qualify — anything carrying a constraint, `$ref`, `const` or metadata is left alone. Runs after `flattenRef`, so a branch an override decorated or `$defs` extraction turned into a `$ref` is no longer bare and correctly stays in `anyOf`. `oneOf` is excluded: `integer` and `number` overlap, so "exactly one" and "at least one" are not the same there. OpenAPI 3.0 is excluded: its `type` must be a single string. */
		function compactTypeUnion(schema) {
			const options = schema.anyOf;
			if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0) return;
			const types = [];
			for (const option of options) {
				if (!option || typeof option !== "object") return;
				compactTypeUnion(option);
				const keys = Object.keys(option);
				if (keys.length !== 1 || keys[0] !== "type") return;
				const type = option.type;
				for (const member of Array.isArray(type) ? type : [type]) {
					if (typeof member !== "string") return;
					if (!types.includes(member)) types.push(member);
				}
			}
			delete schema.anyOf;
			schema.type = types.length === 1 ? types[0] : types;
		}
		/** Keywords `foldIntersection` knows how to combine. Anything else — `$ref`, `patternProperties`,
		* an annotation like `description` — makes a member unfoldable, so a constraint this does not
		* understand leaves the `allOf` alone instead of being silently dropped or misattributed. */
		const FOLDABLE_KEYS = /* @__PURE__ */ new Set([
			"type",
			"properties",
			"required",
			"additionalProperties"
		]);
		const UNION_KEYS = ["oneOf", "anyOf"];
		/** A member's constraint on a key it does not declare itself. A `catchall` states one; `false`, an absent `additionalProperties`, and the empty schema a loose object emits state nothing. */
		function undeclaredConstraint(member) {
			const extra = member.additionalProperties;
			if (extra === void 0 || extra === false || typeof extra !== "object" || extra === null) return null;
			return Object.keys(extra).length ? extra : null;
		}
		/** Combines object members into the single object they describe together, or returns `null` if any of them carries a keyword outside {@link FOLDABLE_KEYS}. */
		function foldObjects(members) {
			const objects = [];
			for (const member of members) {
				if (typeof member !== "object" || member.type !== "object") return null;
				for (const key in member) if (!FOLDABLE_KEYS.has(key)) return null;
				objects.push(member);
			}
			const properties = {};
			const required = /* @__PURE__ */ new Set();
			for (const object of objects) {
				for (const key in object.properties) {
					if (Object.prototype.hasOwnProperty.call(properties, key)) continue;
					const parts = [];
					for (const other of objects) {
						const part = other.properties?.[key] ?? undeclaredConstraint(other);
						if (part === null || part === void 0) continue;
						if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part))) parts.push(part);
					}
					assignProp(properties, key, parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts });
				}
				for (const key of object.required ?? []) required.add(key);
			}
			const folded = {
				type: "object",
				properties
			};
			if (required.size) folded.required = [...required];
			if (objects.every((object) => object.additionalProperties === false)) folded.additionalProperties = false;
			else {
				const constraints = [];
				for (const object of objects) {
					const constraint = undeclaredConstraint(object);
					if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint))) constraints.push(constraint);
				}
				if (constraints.length === 1) folded.additionalProperties = constraints[0];
				else if (constraints.length > 1) folded.additionalProperties = { allOf: constraints };
			}
			return folded;
		}
		/** `additionalProperties` in an `allOf` member sees only that member's own `properties`, so two
		* closed object members reject each other's keys and the schema validates nothing. Zod's parser
		* pools the key sets instead — `handleIntersectionResults` reports a key as unrecognized only when
		* *every* side rejects it — so the emitted schema has to pool them too, and folding the members
		* into one object is the encoding that says so on every target.
		*
		* This runs from `finalize`, after `extractDefs`, which is what keeps it clear of the `$ref`
		* machinery: a member extracted into `$defs` is already a `$ref` by now and declines to fold, so it
		* keeps its reference and its own closedness rather than being inlined as a stale copy. */
		function foldIntersection(json) {
			const allOf = json.allOf;
			if (!Array.isArray(allOf) || allOf.length < 2) return;
			for (const key of FOLDABLE_KEYS) if (key in json) return;
			const unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k])));
			let folded = null;
			if (!unions.length) folded = foldObjects(allOf);
			else {
				const union = unions[0];
				const keyword = UNION_KEYS.find((k) => Array.isArray(union[k]));
				if (Object.keys(union).length !== 1) return;
				const rest = allOf.filter((m) => m !== union);
				const branches = union[keyword].map((branch) => foldObjects([...rest, branch]));
				if (branches.some((b) => !b)) return;
				folded = { [keyword]: branches };
			}
			if (!folded) return;
			delete json.allOf;
			assignProps(json, folded);
		}
		function finalize(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else assignProps(schema, refSchema);
					assignProps(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
				for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
				if (ctx.target !== "openapi-3.0") for (const entry of ctx.seen.entries()) compactTypeUnion(entry[1].def ?? entry[1].schema);
				for (const rewrite of ctx.deferred) rewrite();
				if (ctx.intersections.length) {
					const carriers = /* @__PURE__ */ new Map();
					for (const seen of ctx.seen.values()) for (const json of [seen.schema, seen.def]) {
						const allOf = json?.allOf;
						if (!Array.isArray(allOf)) continue;
						const existing = carriers.get(allOf);
						if (existing) existing.push(json);
						else carriers.set(allOf, [json]);
					}
					for (const allOf of ctx.intersections) for (const json of carriers.get(allOf) ?? []) foldIntersection(json);
				}
			}
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
			assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					assignProp(defs, seen.defId, seen.def);
				}
			}
			if (ctx.external) ctx.sharedEmitDoneFor = ctx.external;
			if (ctx.external) {} else if (Object.keys(defs).length > 0) {
				if (ctx.target === "draft-2020-12") result.$defs = defs;
				else result.definitions = defs;
			}
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
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming(def.element, ctx);
			if (def.type === "set") return isTransforming(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") return isTransforming(def.innerType, ctx);
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
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/json-schema-processors.js
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
			const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time" || laxFormat) delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const patternList = [...patterns];
				if (patternList.length === 1) json.pattern = patternList[0].source;
				else if (patternList.length > 1) json.allOf = [...patternList.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
			if (typeof format === "string" && format.includes("int")) json.type = "integer";
			else json.type = "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) {
				if (legacy) {
					json.minimum = exclusiveMinimum;
					json.exclusiveMinimum = true;
				} else json.exclusiveMinimum = exclusiveMinimum;
			} else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) {
				if (legacy) {
					json.maximum = exclusiveMaximum;
					json.exclusiveMaximum = true;
				} else json.exclusiveMaximum = exclusiveMaximum;
			} else if (typeof maximum === "number") json.maximum = maximum;
			if (typeof multipleOf === "number") {
				if (Number.isFinite(multipleOf) && multipleOf !== 0) json.multipleOf = Math.abs(multipleOf);
				else handleUnrepresentable(schema, ctx, json, params, `A multipleOf divisor of ${multipleOf} cannot be represented in JSON Schema`);
			}
		};
		const booleanProcessor = (_schema, _ctx, json, _params) => {
			json.type = "boolean";
		};
		const undefinedProcessor = (schema, ctx, json, params) => {
			handleUnrepresentable(schema, ctx, json, params, "Undefined cannot be represented in JSON Schema");
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.length === 0) {
				json.not = {};
				return;
			}
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const literalProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			if (def.values.length === 0) {
				json.not = {};
				return;
			}
			const vals = [];
			for (const val of def.values) if (val === void 0) {
				if (handleUnrepresentable(schema, ctx, json, params, "Literal `undefined` cannot be represented in JSON Schema")) return;
			} else if (typeof val === "bigint") {
				if (handleUnrepresentable(schema, ctx, json, params, "BigInt literals cannot be represented in JSON Schema")) return;
				vals.push(Number(val));
			} else vals.push(val);
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
		const customProcessor = (schema, ctx, json, params) => {
			handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (schema, ctx, json, params) => {
			handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
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
		function inputOptin(schema) {
			const def = schema._zod.def;
			if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) return inputOptin(def.out);
			if (def.type === "catch") return inputOptin(def.innerType);
			return schema._zod.optin;
		}
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const shape = def.shape;
			if (Object.getOwnPropertySymbols(shape).length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema")) return;
			json.type = "object";
			json.properties = {};
			for (const key in shape) assignProp(json.properties, key, process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			}));
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const field = def.shape[key];
				if (ctx.io === "input") return inputOptin(field) === void 0;
				else return field._zod.optout === void 0;
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
			ctx.intersections.push(allOf);
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
		/** Round-trips a default value through JSON so the emitted schema is guaranteed to be valid JSON.
		* A BigInt has no reliable encoding, so it goes through `unrepresentable` like any other
		* unrepresentable value. Returns a sentinel when the caller must not write a default of its own. */
		const UNREPRESENTABLE_DEFAULT = Symbol();
		function serializeDefaultValue(value, schema, ctx, json, params) {
			let unrepresentable = false;
			const serialized = JSON.stringify(value, (_, val) => {
				if (typeof val !== "bigint") return val;
				unrepresentable = true;
				return null;
			});
			if (!unrepresentable) return JSON.parse(serialized);
			handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema");
			return UNREPRESENTABLE_DEFAULT;
		}
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
			if (value !== UNREPRESENTABLE_DEFAULT) json.default = value;
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io !== "input") return;
			const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
			if (value !== UNREPRESENTABLE_DEFAULT) json._prefault = value;
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
				handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
				return;
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
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/classic/errors.js
		const _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
		function _lazyMethod(proto, key, make) {
			Object.defineProperty(proto, key, {
				configurable: true,
				enumerable: false,
				get() {
					const value = make(this);
					Object.defineProperty(this, key, {
						value,
						configurable: true,
						writable: true
					});
					return value;
				},
				set(value) {
					Object.defineProperty(this, key, {
						value,
						configurable: true,
						writable: true
					});
				}
			});
		}
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			const proto = Object.getPrototypeOf(inst);
			if (_installedErrorProtos.has(proto)) return;
			_installedErrorProtos.add(proto);
			_lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper));
			_lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
			_lazyMethod(proto, "addIssue", (self) => (issue) => {
				self.issues.push(issue);
				self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
			});
			_lazyMethod(proto, "addIssues", (self) => (issues) => {
				self.issues.push(...issues);
				self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
			});
			Object.defineProperty(proto, "isEmpty", {
				configurable: true,
				enumerable: false,
				get() {
					return this.issues.length === 0;
				}
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, void 0, { Parent: Error });
		//#endregion
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/classic/parse.js
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
		//#region ../node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/classic/schemas.js
		function _ensureDefaultLocale() {
			if (!globalConfig.localeError) config(en_default());
		}
		function _ensureDefaultMemoizer() {
			if (!globalConfig.memoizer) config({ memoizer: memoizer() });
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			_ensureDefaultLocale();
			$ZodType.init(inst, def);
			inst.def = def;
			inst.type = def.type;
			return inst;
		}, {
			check(...chks) {
				const def = this.def;
				return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
					check: ch,
					def: { check: "custom" },
					onattach: []
				} } : ch)] }), { parent: true });
			},
			with(...chks) {
				return this.check(...chks);
			},
			clone(def, params) {
				return clone(this, def, params);
			},
			brand() {
				return this;
			},
			register(reg, meta) {
				reg.add(this, meta);
				return this;
			},
			refine(check, params) {
				return this.check(refine(check, params));
			},
			superRefine(refinement, params) {
				return this.check(superRefine(refinement, params));
			},
			overwrite(fn) {
				return this.check(/* @__PURE__ */ _overwrite(fn));
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
			apply(fn, ...args) {
				return args.length === 0 ? fn(this) : fn(this, ...args);
			},
			get "~standard"() {
				return hide(this, "~standard", {
					...standardProps(this),
					jsonSchema: {
						input: createStandardJSONSchemaMethod(this, "input"),
						output: createStandardJSONSchemaMethod(this, "output")
					}
				});
			},
			set "~standard"(value) {
				own(this, "~standard", value);
			},
			parse: function _parse(data, params) {
				return parse(this, data, params, { callee: _parse });
			},
			parseAsync: async function _parseAsync(data, params) {
				return await parseAsync(this, data, params, { callee: _parseAsync });
			},
			safeParse(data, params) {
				return safeParse(this, data, params);
			},
			async safeParseAsync(data, params) {
				return safeParseAsync(this, data, params);
			},
			get spa() {
				return this?.safeParseAsync;
			},
			set spa(value) {
				own(this, "spa", value);
			},
			encode: function _encode(data, params) {
				return encode(this, data, params, { callee: _encode });
			},
			decode: function _decode(data, params) {
				return decode(this, data, params, { callee: _decode });
			},
			encodeAsync: async function _encodeAsync(data, params) {
				return await encodeAsync(this, data, params, { callee: _encodeAsync });
			},
			decodeAsync: async function _decodeAsync(data, params) {
				return await decodeAsync(this, data, params, { callee: _decodeAsync });
			},
			safeEncode(data, params) {
				return safeEncode(this, data, params);
			},
			safeDecode(data, params) {
				return safeDecode(this, data, params);
			},
			async safeEncodeAsync(data, params) {
				return safeEncodeAsync(this, data, params);
			},
			async safeDecodeAsync(data, params) {
				return safeDecodeAsync(this, data, params);
			},
			toJSONSchema(params) {
				return createToJSONSchemaMethod(this, {})(params);
			},
			get description() {
				return globalRegistry.get(this)?.description;
			},
			get _def() {
				return this._zod.def;
			}
		});
		/** @internal */
		const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.format = bag.format ?? null;
			inst.minLength = bag.minimum ?? null;
			inst.maxLength = bag.maximum ?? null;
		}, {
			regex(...args) {
				return this.check(/* @__PURE__ */ _regex(...args));
			},
			includes(...args) {
				return this.check(/* @__PURE__ */ _includes(...args));
			},
			startsWith(...args) {
				return this.check(/* @__PURE__ */ _startsWith(...args));
			},
			endsWith(...args) {
				return this.check(/* @__PURE__ */ _endsWith(...args));
			},
			min(...args) {
				return this.check(/* @__PURE__ */ _minLength(...args));
			},
			max(...args) {
				return this.check(/* @__PURE__ */ _maxLength(...args));
			},
			length(...args) {
				return this.check(/* @__PURE__ */ _length(...args));
			},
			nonempty(...args) {
				return this.check(/* @__PURE__ */ _minLength(1, ...args));
			},
			lowercase(params) {
				return this.check(/* @__PURE__ */ _lowercase(params));
			},
			uppercase(params) {
				return this.check(/* @__PURE__ */ _uppercase(params));
			},
			trim() {
				return this.check(/* @__PURE__ */ _trim());
			},
			normalize(...args) {
				return this.check(/* @__PURE__ */ _normalize(...args));
			},
			toLowerCase() {
				return this.check(/* @__PURE__ */ _toLowerCase());
			},
			toUpperCase() {
				return this.check(/* @__PURE__ */ _toUpperCase());
			},
			slugify() {
				return this.check(/* @__PURE__ */ _slugify());
			}
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
		}, {
			email(params) {
				return this.check(/* @__PURE__ */ _email(ZodEmail, params));
			},
			url(params) {
				return this.check(/* @__PURE__ */ _url(ZodURL, params));
			},
			jwt(params) {
				return this.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			},
			emoji(params) {
				return this.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			},
			guid(params) {
				return this.check(/* @__PURE__ */ _guid(ZodGUID, params));
			},
			uuid(params) {
				return this.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			},
			uuidv4(params) {
				return this.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			},
			uuidv6(params) {
				return this.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			},
			uuidv7(params) {
				return this.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			},
			nanoid(params) {
				return this.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			},
			cuid(params) {
				return this.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			},
			cuid2(params) {
				return this.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			},
			ulid(params) {
				return this.check(/* @__PURE__ */ _ulid(ZodULID, params));
			},
			base64(params) {
				return this.check(/* @__PURE__ */ _base64(ZodBase64, params));
			},
			base64url(params) {
				return this.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			},
			xid(params) {
				return this.check(/* @__PURE__ */ _xid(ZodXID, params));
			},
			ksuid(params) {
				return this.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			},
			ipv4(params) {
				return this.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			},
			ipv6(params) {
				return this.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			},
			cidrv4(params) {
				return this.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			},
			cidrv6(params) {
				return this.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			},
			e164(params) {
				return this.check(/* @__PURE__ */ _e164(ZodE164, params));
			},
			datetime(params) {
				return this.check(/* @__PURE__ */ _isoDateTime(ZodISODateTime, params));
			},
			date(params) {
				return this.check(/* @__PURE__ */ _isoDate(ZodISODate, params));
			},
			time(params) {
				return this.check(/* @__PURE__ */ _isoTime(ZodISOTime, params));
			},
			duration(params) {
				return this.check(/* @__PURE__ */ _isoDuration(ZodISODuration, params));
			}
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
		});
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
			$ZodEmail.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
			$ZodGUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
			$ZodUUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
			$ZodURL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
			$ZodEmoji.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
			$ZodNanoID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
			$ZodCUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
			$ZodCUID2.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
			$ZodULID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
			$ZodXID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
			$ZodKSUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
			$ZodIPv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
			$ZodIPv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
			$ZodBase64.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
			$ZodBase64URL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
			$ZodE164.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
			$ZodJWT.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
			$ZodNumber.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
			inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
			inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
			inst.isFinite = true;
			inst.format = bag.format ?? null;
		}, {
			gt(value, params) {
				return this.check(/* @__PURE__ */ _gt(value, params));
			},
			gte(value, params) {
				return this.check(/* @__PURE__ */ _gte(value, params));
			},
			min(value, params) {
				return this.check(/* @__PURE__ */ _gte(value, params));
			},
			lt(value, params) {
				return this.check(/* @__PURE__ */ _lt(value, params));
			},
			lte(value, params) {
				return this.check(/* @__PURE__ */ _lte(value, params));
			},
			max(value, params) {
				return this.check(/* @__PURE__ */ _lte(value, params));
			},
			int(params) {
				return this.check(int(params));
			},
			safe(params) {
				return this.check(int(params));
			},
			positive(params) {
				return this.check(/* @__PURE__ */ _gt(0, params));
			},
			nonnegative(params) {
				return this.check(/* @__PURE__ */ _gte(0, params));
			},
			negative(params) {
				return this.check(/* @__PURE__ */ _lt(0, params));
			},
			nonpositive(params) {
				return this.check(/* @__PURE__ */ _lte(0, params));
			},
			multipleOf(value, params) {
				return this.check(/* @__PURE__ */ _multipleOf(value, params));
			},
			step(value, params) {
				return this.check(/* @__PURE__ */ _multipleOf(value, params));
			},
			finite() {
				return this;
			}
		});
		function number(params) {
			return /* @__PURE__ */ _number(ZodNumber, params);
		}
		const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
			$ZodNumberFormat.init(inst, def);
			ZodNumber.init(inst, def);
		});
		function int(params) {
			return /* @__PURE__ */ _int(ZodNumberFormat, params);
		}
		const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
			$ZodBoolean.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
		});
		function boolean(params) {
			return /* @__PURE__ */ _boolean(ZodBoolean, params);
		}
		const ZodUndefined = /*@__PURE__*/ $constructor("ZodUndefined", (inst, def) => {
			$ZodUndefined.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => undefinedProcessor(inst, ctx, json, params);
		});
		function _undefined(params) {
			return /* @__PURE__ */ _undefined$1(ZodUndefined, params);
		}
		const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
			$ZodUnknown.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown() {
			return /* @__PURE__ */ _unknown(ZodUnknown);
		}
		const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
			$ZodNever.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
		});
		function never(params) {
			return /* @__PURE__ */ _never(ZodNever, params);
		}
		const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
			_ensureDefaultMemoizer();
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
		}, {
			min(n, params) {
				return this.check(/* @__PURE__ */ _minLength(n, params));
			},
			nonempty(params) {
				return this.check(/* @__PURE__ */ _minLength(1, params));
			},
			max(n, params) {
				return this.check(/* @__PURE__ */ _maxLength(n, params));
			},
			length(n, params) {
				return this.check(/* @__PURE__ */ _length(n, params));
			},
			unwrap() {
				return this.element;
			}
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			_ensureDefaultMemoizer();
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
		}, {
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
			exactPartial(...args) {
				return partial(ZodExactOptional, this, args[0], "exactPartial");
			},
			required(...args) {
				return required(ZodNonOptional, this, args[0]);
			}
		});
		function object(shape, params) {
			const def = {
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			};
			return new ZodObject(def);
		}
		const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
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
		const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
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
		const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
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
		const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
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
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
			_ensureDefaultMemoizer();
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
						if (!("input" in _issue)) _issue.input = payload.value;
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					return payload;
				});
				payload.value = output;
				return payload;
			};
		});
		function transform(fn) {
			return new ZodTransform({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
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
		const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
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
		const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
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
		const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
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
		const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
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
		const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
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
		const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
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
				catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
			});
		}
		const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
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
		const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
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
		const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
			$ZodCustom.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
		});
		function refine(fn, _params = {}) {
			return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
		}
		function superRefine(fn, params) {
			return /* @__PURE__ */ _superRefine(fn, params);
		}
		//#endregion
		//#region src/remote-contribution.ts
		/**
		* 本插件浏览器半经此挂载的 yuyi Remote 贡献
		* `ctx.remote.$mount`。从 harness typert 生成器
		* 为同一服务发出的产物；线路命名空间与 schema 不变，
		* 因此宿主 source-mode 发现原样应答这些端点。
		*
		* 手工维护注记：`yuyi/collab` 描述符为本仓库手工追加
		* （跟随 service.ts 的 `@Remote('collab')`）。若上游生成器
		* 重新生成本文件，需按 git 历史重放该描述符。
		*/
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
		/**
		* 兼容 shim：core 0.1.6-alpha.2 起 typert-registry 的 `validateCodec`
		* 对 strict codec 的契约从「schema 自带 parse()」改为「codec 本体自带
		* create() 惰性工厂」（registry 内嵌 zod v4，`materializeSchema` 以
		* `record.value ??= record.create()` 惰性物化）。dsh-yuyi 的远端贡献是
		* 手维护的旧契约产物（codec 上只有 `schema`，没有 `create`），$mount 在
		* DescriptorStore.validate 即遭拒绝，`remote.yuyi` 整个命名空间不挂载。
		*
		* 本函数给每个 strict codec 补 `create: () => codec.schema`（幂等：已有
		* create 的原样保留）。schema 属性同时保留——宿主侧按 schema.parse 做
		* 载荷校验，客户端网关只校验 create 的存在性。
		*/
		function ensureCodecFactory(codec) {
			if (codec.mode !== "strict") return;
			if (typeof codec.create === "function") return;
			const schema = codec.schema;
			codec.create = () => schema;
		}
		for (const descriptor of TYPERT_REMOTE.descriptors) {
			const result = descriptor.result;
			if (result) ensureCodecFactory(result);
			if (Array.isArray(descriptor.parameters)) for (const parameter of descriptor.parameters) {
				const codec = parameter?.codec;
				if (codec) ensureCodecFactory(codec);
			}
			const invocation = descriptor.invocation;
			if (invocation && invocation.codec) ensureCodecFactory(invocation.codec);
		}
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
			readStatus;
			state = { current: void 0 };
			listeners = /* @__PURE__ */ new Set();
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
					if (!(typeof document !== "undefined" && document.visibilityState === "hidden")) this.refresh();
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
			readCollab;
			state = { current: void 0 };
			listeners = /* @__PURE__ */ new Set();
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
					if (!(typeof document !== "undefined" && document.visibilityState === "hidden")) this.refresh();
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
		//#region src/client/dock-handshake.ts
		/**
		* 套件状态坞握手（dsh-twin suite-dock 契约，客户端侧感知端）。
		*
		* 常量为 dsh-twin/src/client/suite-dock-model.ts 的拷贝（宪章 §3.1：套件包
		* 之间零运行时共享）。语义：dock 挂载期写 localStorage 心跳 `dsh-suite-dock`；
		* 本侧见新鲜心跳 → 右缘拉手让位（dock 的御驿行代为入口，经
		* `suite-dock:yuyi-open` 事件回开本面板）；dock 缺席 → 拉手自动回归。
		*/
		const DOCK_STORAGE_KEY = "dsh-suite-dock";
		const EV_READY = "suite-dock:ready";
		const EV_GONE = "suite-dock:gone";
		/** 心跳新鲜判定：90s 内的 ISO 时间戳 = dock 在场。 */
		function dockFresh(raw, now = Date.now()) {
			if (raw === null || raw === void 0 || raw === "") return false;
			const t = Date.parse(raw);
			return Number.isFinite(t) && now - t >= 0 && now - t < 9e4;
		}
		function safeGet() {
			try {
				return typeof localStorage !== "undefined" ? localStorage.getItem(DOCK_STORAGE_KEY) : null;
			} catch {
				return null;
			}
		}
		/** dock 是否在场（挂载时读心跳 + 监听 ready/gone + 30s 兜底复查）。 */
		function useDockPresent() {
			const [present, setPresent] = (0, react.useState)(() => dockFresh(safeGet()));
			(0, react.useEffect)(() => {
				const recheck = () => {
					setPresent(dockFresh(safeGet()));
				};
				window.addEventListener(EV_READY, recheck);
				window.addEventListener(EV_GONE, recheck);
				const t = window.setInterval(recheck, 3e4);
				return () => {
					window.removeEventListener(EV_READY, recheck);
					window.removeEventListener(EV_GONE, recheck);
					window.clearInterval(t);
				};
			}, []);
			return present;
		}
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
		const ACTIVE_WINDOW_MS = 12e4;
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
			const seen = /* @__PURE__ */ new Set([self.name.toLowerCase(), ...rosterNames(status)]);
			const all = [self, ...peerCards.filter((card) => {
				const id = `${card.name.toLowerCase()}@${card.device.toLowerCase()}`;
				if (seen.has(card.name.toLowerCase())) return false;
				seen.add(id);
				return true;
			})];
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
			const depsOf = /* @__PURE__ */ new Map();
			const known = /* @__PURE__ */ new Set();
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
			const columnOf = /* @__PURE__ */ new Map();
			const visiting = /* @__PURE__ */ new Set();
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
			const pushed = /* @__PURE__ */ new Set();
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
			const byTo = /* @__PURE__ */ new Map();
			for (const edge of layout.edges) {
				const list = byTo.get(edge.to) ?? [];
				list.push(edge.from);
				byTo.set(edge.to, list);
			}
			const seen = /* @__PURE__ */ new Set();
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
		//#region \0dsh-yuyi-css:E:\Development\Code\nodejs\digital-twin\dsh-yuyi\src\client\panel\YuyiPanel.module.css.mjs
		const css$1 = "/* 御驿协同活动面板：shell._cdafde5055_overlay 浮层里的右缘停靠卡。\r\n   颜色/间距/圆角全走产品语义令牌（--dsw-alias-*）；宿主\r\n   overlayLayer 已对直接子节点恢复 pointer-events:auto，\r\n   面板只需管好自己的定位与层高。 */\r\n\r\n._4f4344637a_panel {\r\n  position: absolute;\r\n  /* 顶端让开标题栏+视图标签行（v0.1.11：96px——桌面壳头部更高，80 会擦碰），\r\n     底端让开输入区/发送区——不与窗口控制按钮和 composer 争位。 */\r\n  top: 96px;\r\n  right: 12px;\r\n  bottom: 140px;\r\n  width: 340px;\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 12px;\r\n  padding: 14px 14px 18px;\r\n  overflow-y: auto;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  border-radius: 14px;\r\n  background: var(--dsw-alias-bg-base);\r\n  box-shadow: 0 8px 28px rgb(0 0 0 / 22%);\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n/* ── 头部（标题 + 连接态 + 关闭） ─────────────────────── */\r\n\r\n._b728e4d636_head {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n  flex: none;\r\n}\r\n\r\n._b65a077a72_headTitle {\r\n  margin: 0;\r\n  font-size: 13px;\r\n  font-weight: 600;\r\n  line-height: 1.5;\r\n}\r\n\r\n._96e4b57088_stateLabel {\r\n  font-size: 11px;\r\n  line-height: 1.5;\r\n}\r\n\r\n._96e4b57088_stateLabel[data-state='connected'] { color: var(--dsw-alias-state-success-primary); }\r\n._96e4b57088_stateLabel[data-state='disconnected'] { color: var(--dsw-alias-state-warn-primary); }\r\n._96e4b57088_stateLabel[data-state='unconfigured'] { color: var(--dsw-alias-state-error-primary); }\r\n\r\n._b7bc171096_devicePill {\r\n  margin-left: auto;\r\n  max-width: 40%;\r\n  min-width: 0;\r\n}\r\n\r\n._075470f69e_deviceName {\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n  font-family: var(--dsw-font-mono, var(--ds-font-family-code, ui-monospace, monospace));\r\n  font-size: 11px;\r\n}\r\n\r\n._895f4a82e7_closeBtn {\r\n  flex: none;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  width: 24px;\r\n  height: 24px;\r\n  padding: 0;\r\n  border: none;\r\n  border-radius: 8px;\r\n  background: transparent;\r\n  color: var(--dsw-alias-label-tertiary);\r\n  cursor: pointer;\r\n  font-size: 14px;\r\n  line-height: 1;\r\n}\r\n\r\n._895f4a82e7_closeBtn:hover { background: var(--dsw-alias-interactive-bg-hover); }\r\n\r\n/* ── 概览行 + 分段进度条 + 图例 ───────────────────────── */\r\n\r\n._6a007b529f_overview {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 4px 12px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-secondary);\r\n  flex: none;\r\n}\r\n\r\n._0140a0a4f2_overviewStrong { font-weight: 600; color: var(--dsw-alias-label-primary); }\r\n\r\n._2591e04d23_progress {\r\n  display: flex;\r\n  height: 6px;\r\n  border-radius: 999px;\r\n  overflow: hidden;\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  flex: none;\r\n}\r\n\r\n._f0c9b49640_progressSegment { min-width: 0; transition: width 0.25s ease; }\r\n\r\n._f0c9b49640_progressSegment[data-kind='in_progress'] { background: var(--dsw-alias-brand-primary, var(--dsw-alias-label-primary)); }\r\n._f0c9b49640_progressSegment[data-kind='awaiting'] { background: var(--dsw-alias-state-warn-primary); }\r\n._f0c9b49640_progressSegment[data-kind='deliverable'] { background: var(--dsw-alias-state-business-primary, var(--dsw-alias-state-success-primary)); }\r\n._f0c9b49640_progressSegment[data-kind='done'] { background: var(--dsw-alias-state-success-primary); }\r\n\r\n._5776ff5d7f_legend {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 4px 12px;\r\n  font-size: 11px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n  flex: none;\r\n}\r\n\r\n._ec134f62a2_legendItem { display: inline-flex; align-items: center; gap: 5px; }\r\n\r\n._92095b2f89_legendDot {\r\n  width: 7px;\r\n  height: 7px;\r\n  border-radius: 50%;\r\n  flex: none;\r\n}\r\n\r\n._92095b2f89_legendDot[data-kind='in_progress'] { background: var(--dsw-alias-brand-primary, var(--dsw-alias-label-primary)); }\r\n._92095b2f89_legendDot[data-kind='awaiting'] { background: var(--dsw-alias-state-warn-primary); }\r\n._92095b2f89_legendDot[data-kind='deliverable'] { background: var(--dsw-alias-state-business-primary, var(--dsw-alias-state-success-primary)); }\r\n._92095b2f89_legendDot[data-kind='done'] { background: var(--dsw-alias-state-success-primary); }\r\n\r\n/* ── 区块（同旧标签页 groupHead 语言） ────────────────── */\r\n\r\n._396b15f12d_section {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 8px;\r\n  flex: none;\r\n}\r\n\r\n._5e610f83c7_sectionHead {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n}\r\n\r\n._8277b9ff7c_sectionTitle {\r\n  margin: 0;\r\n  font-size: 12px;\r\n  font-weight: 600;\r\n  letter-spacing: 0.06em;\r\n  text-transform: uppercase;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._46f3b0b555_count {\r\n  margin-left: auto;\r\n  border-radius: 999px;\r\n  padding: 1px 8px;\r\n  font-size: 11px;\r\n  line-height: 17px;\r\n  font-weight: 500;\r\n  white-space: nowrap;\r\n  background: var(--dsw-alias-bg-module-platform);\r\n  color: var(--dsw-alias-label-secondary);\r\n}\r\n\r\n._025945fe5f_errorBanner {\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-state-error-primary);\r\n  border-left: 3px solid var(--dsw-alias-state-error-primary);\r\n  border-radius: 6px;\r\n  background: var(--dsw-alias-bg-layer-2);\r\n  padding: 6px 10px;\r\n  margin: 0;\r\n  overflow-wrap: anywhere;\r\n  flex: none;\r\n}\r\n\r\n/* ── avatar 主理卡 ────────────────────────────────────── */\r\n\r\n._65255de0d7_avatarCard {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 10px;\r\n  padding: 12px;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  border-radius: 12px;\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  flex: none;\r\n}\r\n\r\n._9fe4075c2c_avatarGlyph {\r\n  width: 34px;\r\n  height: 34px;\r\n  border-radius: 50%;\r\n  flex: none;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  font-size: 14px;\r\n  font-weight: 600;\r\n  color: var(--dsw-alias-label-secondary);\r\n  background: var(--dsw-alias-bg-layer-2);\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  user-select: none;\r\n}\r\n\r\n._ba53bcfbf8_avatarMain { min-width: 0; display: flex; flex-direction: column; gap: 1px; }\r\n\r\n._eecee9b29b_avatarNameRow { display: flex; align-items: center; gap: 6px; min-width: 0; }\r\n\r\n._7e97645469_avatarName {\r\n  font-size: 13px;\r\n  font-weight: 600;\r\n  line-height: 1.5;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n._0c1390cdf3_avatarSub {\r\n  font-size: 11px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n/* ── 成员卡 ───────────────────────────────────────────── */\r\n\r\n._524f7f3510_cards { display: flex; flex-direction: column; gap: 2px; }\r\n\r\n._01e9818a87_memberRow {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 10px;\r\n  padding: 8px 10px;\r\n  border-radius: 10px;\r\n  transition: background var(--ds-transition-duration-fast, 0.12s) var(--ds-ease-in-out, ease);\r\n}\r\n\r\n._01e9818a87_memberRow:hover { background: var(--dsw-alias-interactive-bg-hover); }\r\n\r\n._4c90a20e6d_avatar {\r\n  width: 24px;\r\n  height: 24px;\r\n  border-radius: 50%;\r\n  flex: none;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  font-size: 11px;\r\n  font-weight: 600;\r\n  color: var(--dsw-alias-label-secondary);\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  user-select: none;\r\n}\r\n\r\n._022eebeeb7_memberMain { min-width: 0; display: flex; flex-direction: column; gap: 1px; }\r\n\r\n._beea31f54f_memberNameRow { display: flex; align-items: center; gap: 6px; min-width: 0; }\r\n\r\n._4a1dffb879_memberName {\r\n  font-size: 13px;\r\n  font-weight: 500;\r\n  line-height: 1.5;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n._210a5ac276_memberSub {\r\n  font-size: 11px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n._c10b1ce8cc_memberBadges { margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex: none; }\r\n\r\n._a0a437aa69_badgeRow { display: flex; align-items: center; gap: 5px; }\r\n\r\n._d47a69e244_badge {\r\n  font-size: 10px;\r\n  line-height: 16px;\r\n  padding: 0 6px;\r\n  border-radius: 999px;\r\n  white-space: nowrap;\r\n  background: var(--dsw-alias-bg-module-platform);\r\n  color: var(--dsw-alias-label-secondary);\r\n}\r\n\r\n._d47a69e244_badge[data-kind='role'] {\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._d47a69e244_badge[data-kind='running'] { color: var(--dsw-alias-state-success-primary); }\r\n._d47a69e244_badge[data-kind='waiting'] { color: var(--dsw-alias-state-warn-primary); }\r\n\r\n._e4790a8b2a_selfTag {\r\n  font-size: 10px;\r\n  line-height: 16px;\r\n  padding: 0 6px;\r\n  border-radius: 999px;\r\n  /* 主题自带对比保证的主按钮配对：fill + invert 标签。 */\r\n  background: var(--dsw-alias-button-primary-fill, var(--dsw-alias-label-primary));\r\n  color: var(--dsw-alias-brand-primary-invert, var(--dsw-alias-bg-base, #fff));\r\n  white-space: nowrap;\r\n}\r\n\r\n/* ── 任务链卡 + 详情 ──────────────────────────────────── */\r\n\r\n._3be17ce592_taskRow {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 4px;\r\n  padding: 10px 12px;\r\n  border: 1px solid var(--dsw-alias-border-l1);\r\n  border-radius: 10px;\r\n  background: var(--dsw-alias-bg-layer-2);\r\n  cursor: pointer;\r\n  text-align: left;\r\n  font: inherit;\r\n  color: inherit;\r\n  transition: border-color 0.16s, background 0.16s;\r\n}\r\n\r\n._3be17ce592_taskRow:hover { border-color: var(--dsw-alias-border-l2); }\r\n._3be17ce592_taskRow[data-selected='true'] { border-color: var(--dsw-alias-brand-primary, var(--dsw-alias-label-secondary)); }\r\n\r\n._e5072eb997_taskHead { display: flex; align-items: center; gap: 8px; min-width: 0; }\r\n\r\n._f3c1a56cfa_taskId {\r\n  font-family: var(--dsw-font-mono, var(--ds-font-family-code, ui-monospace, monospace));\r\n  font-size: 12px;\r\n  font-weight: 600;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n._da4772ff88_taskStatus {\r\n  margin-left: auto;\r\n  flex: none;\r\n  font-size: 10px;\r\n  line-height: 16px;\r\n  padding: 0 6px;\r\n  border-radius: 999px;\r\n  white-space: nowrap;\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  color: var(--dsw-alias-label-secondary);\r\n}\r\n\r\n._da4772ff88_taskStatus[data-status='in_progress'] { color: var(--dsw-alias-brand-primary, var(--dsw-alias-label-primary)); }\r\n._da4772ff88_taskStatus[data-status='awaiting'] { color: var(--dsw-alias-state-warn-primary); }\r\n._da4772ff88_taskStatus[data-status='deliverable'] { color: var(--dsw-alias-state-business-primary, var(--dsw-alias-state-success-primary)); }\r\n._da4772ff88_taskStatus[data-status='done'] { color: var(--dsw-alias-state-success-primary); }\r\n._da4772ff88_taskStatus[data-status='archived'] { color: var(--dsw-alias-label-tertiary); }\r\n\r\n._a0314355fd_taskGoal {\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-secondary);\r\n  overflow: hidden;\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 2;\r\n  -webkit-box-orient: vertical;\r\n}\r\n\r\n._5ae110ee6e_taskMeta {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 2px 12px;\r\n  font-size: 11px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._c3770dd1ab_detail { display: flex; flex-direction: column; gap: 8px; }\r\n\r\n._9205ad8c11_detailBlock { display: flex; flex-direction: column; gap: 3px; }\r\n\r\n._d564c7f262_detailLabel {\r\n  font-size: 11px;\r\n  font-weight: 600;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._5a12cc65d6_detailText {\r\n  font-size: 12px;\r\n  line-height: 1.55;\r\n  color: var(--dsw-alias-label-primary);\r\n  overflow-wrap: anywhere;\r\n  margin: 0;\r\n}\r\n\r\n._507e789171_criterion { display: flex; gap: 6px; font-size: 12px; line-height: 1.55; }\r\n\r\n._551b80901b_criterionMark { flex: none; }\r\n\r\n._c3cd925b04_criterionText { color: var(--dsw-alias-label-primary); overflow-wrap: anywhere; }\r\n\r\n._a294420ff9_criterionEvidence { color: var(--dsw-alias-label-tertiary); }\r\n\r\n._aa5306563d_depLink {\r\n  border: none;\r\n  background: none;\r\n  padding: 0;\r\n  font: inherit;\r\n  font-size: 12px;\r\n  color: var(--dsw-alias-brand-primary, var(--dsw-alias-label-secondary));\r\n  cursor: pointer;\r\n  text-decoration: underline;\r\n  text-underline-offset: 2px;\r\n}\r\n\r\n/* ── 依赖 DAG（SVG） ─────────────────────────────────── */\r\n\r\n._d9caa54c3c_graphScroll { overflow-x: auto; padding-bottom: 4px; }\r\n\r\n._0e52b1affb_graphNode { cursor: pointer; }\r\n\r\n._48b9ffffd5_graphNodeRect {\r\n  fill: var(--dsw-alias-bg-layer-3);\r\n  stroke: var(--dsw-alias-border-l2);\r\n}\r\n\r\n._0e52b1affb_graphNode[data-selected='true'] ._48b9ffffd5_graphNodeRect,\r\n._0e52b1affb_graphNode[data-hot='true'] ._48b9ffffd5_graphNodeRect { stroke: var(--dsw-alias-brand-primary, var(--dsw-alias-label-secondary)); }\r\n\r\n._2872986b90_graphNodeText {\r\n  fill: var(--dsw-alias-label-primary);\r\n  font-size: 10px;\r\n  font-family: var(--dsw-font-mono, var(--ds-font-family-code, ui-monospace, monospace));\r\n}\r\n\r\n._27734391f5_graphNodeGhost ._2872986b90_graphNodeText { fill: var(--dsw-alias-label-tertiary); }\r\n\r\n._25ef714580_graphEdge {\r\n  fill: none;\r\n  stroke: var(--dsw-alias-border-l2);\r\n  stroke-width: 1.4;\r\n}\r\n\r\n._25ef714580_graphEdge[data-hot='true'] { stroke: var(--dsw-alias-brand-primary, var(--dsw-alias-label-secondary)); }\r\n\r\n._6ee2d8d6c6_graphHint { font-size: 11px; line-height: 1.5; color: var(--dsw-alias-label-tertiary); }\r\n\r\n/* ── 停靠消息 + 空态 ─────────────────────────────────── */\r\n\r\n._0211ce1c83_inboxRow {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 2px;\r\n  padding: 10px 12px;\r\n  border: 1px solid var(--dsw-alias-border-l1);\r\n  border-radius: 10px;\r\n  background: var(--dsw-alias-bg-layer-2);\r\n}\r\n\r\n._26cf3afb66_inboxFrom {\r\n  font-size: 12px;\r\n  font-weight: 600;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-secondary);\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n._e5a4beb446_inboxText {\r\n  font-size: 13px;\r\n  line-height: 1.55;\r\n  color: var(--dsw-alias-label-primary);\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n._1eb61a42d6_emptyWell {\r\n  padding: 14px;\r\n  border: 1px dashed var(--dsw-alias-border-l2);\r\n  border-radius: 10px;\r\n  text-align: center;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n/* ── 会话内卡片 ──────────────────────────────────────── */\r\n\r\n._497d8d6b65_toolCard {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 6px;\r\n  padding: 10px 12px;\r\n  border: 1px solid var(--dsw-alias-border-l1);\r\n  border-radius: 10px;\r\n  background: var(--dsw-alias-bg-layer-2);\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n}\r\n\r\n._1ecbb9185d_toolCardHead { display: flex; align-items: center; gap: 8px; min-width: 0; }\r\n\r\n._02c041d7a6_toolCardTitle { font-weight: 600; color: var(--dsw-alias-label-primary); flex: none; }\r\n\r\n._50efcbfdd0_toolCardTo {\r\n  font-family: var(--dsw-font-mono, var(--ds-font-family-code, ui-monospace, monospace));\r\n  font-size: 11px;\r\n  color: var(--dsw-alias-label-secondary);\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n._0486417958_toolCardBody { color: var(--dsw-alias-label-primary); overflow-wrap: anywhere; }\r\n\r\n._4882505683_toolCardPreview {\r\n  color: var(--dsw-alias-label-secondary);\r\n  overflow: hidden;\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 2;\r\n  -webkit-box-orient: vertical;\r\n}\r\n\r\n._23b91df096_openPanelBtn {\r\n  align-self: flex-start;\r\n  border: none;\r\n  background: none;\r\n  padding: 0;\r\n  font: inherit;\r\n  font-size: 11px;\r\n  color: var(--dsw-alias-brand-primary, var(--dsw-alias-label-secondary));\r\n  cursor: pointer;\r\n  text-decoration: underline;\r\n  text-underline-offset: 2px;\r\n}\r\n\r\n._c719fc3016_railTab {\r\n  position: absolute;\r\n  /* v0.1.11 改为底部锚定（右下角存在体上方）：顶部角落带（原生工具行 +\r\n     套件状态坞）不再参与——dock 在场时本拉手整体让位，此处是 dock 缺席\r\n     （twin 未装）时的回落形态。 */\r\n  top: auto;\r\n  bottom: 160px;\r\n  right: 0;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  gap: 8px;\r\n  padding: 12px 5px;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  border-right: none;\r\n  border-radius: 10px 0 0 10px;\r\n  background: var(--dsw-alias-bg-layer-2);\r\n  color: var(--dsw-alias-label-secondary);\r\n  cursor: pointer;\r\n  font: inherit;\r\n  transition: background var(--ds-transition-duration-fast, 0.12s) var(--ds-ease-in-out, ease);\r\n}\r\n\r\n._c719fc3016_railTab:hover {\r\n  background: var(--dsw-alias-interactive-bg-hover);\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n/* 状态点：configured/connected 点亮（成功绿，主题自适应），未配置保持灰。 */\r\n._094406740c_railDot {\r\n  width: 7px;\r\n  height: 7px;\r\n  border-radius: 50%;\r\n  flex: none;\r\n  background: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._094406740c_railDot[data-configured='true'] {\r\n  background: var(--dsw-alias-state-success-primary);\r\n}\r\n\r\n._a0e0d441aa_railText {\r\n  writing-mode: vertical-rl;\r\n  font-size: 11px;\r\n  letter-spacing: 0.14em;\r\n  line-height: 1;\r\n  user-select: none;\r\n  white-space: nowrap;\r\n}\r\n";
		const tagId$1 = "dsh-yuyi/YuyiPanel.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-yuyi";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var YuyiPanel_module_css_default = {
			"overlay": "_cdafde5055_overlay",
			"panel": "_4f4344637a_panel",
			"head": "_b728e4d636_head",
			"headTitle": "_b65a077a72_headTitle",
			"stateLabel": "_96e4b57088_stateLabel",
			"devicePill": "_b7bc171096_devicePill",
			"deviceName": "_075470f69e_deviceName",
			"closeBtn": "_895f4a82e7_closeBtn",
			"overview": "_6a007b529f_overview",
			"overviewStrong": "_0140a0a4f2_overviewStrong",
			"progress": "_2591e04d23_progress",
			"progressSegment": "_f0c9b49640_progressSegment",
			"legend": "_5776ff5d7f_legend",
			"legendItem": "_ec134f62a2_legendItem",
			"legendDot": "_92095b2f89_legendDot",
			"section": "_396b15f12d_section",
			"sectionHead": "_5e610f83c7_sectionHead",
			"sectionTitle": "_8277b9ff7c_sectionTitle",
			"count": "_46f3b0b555_count",
			"errorBanner": "_025945fe5f_errorBanner",
			"avatarCard": "_65255de0d7_avatarCard",
			"avatarGlyph": "_9fe4075c2c_avatarGlyph",
			"avatarMain": "_ba53bcfbf8_avatarMain",
			"avatarNameRow": "_eecee9b29b_avatarNameRow",
			"avatarName": "_7e97645469_avatarName",
			"avatarSub": "_0c1390cdf3_avatarSub",
			"cards": "_524f7f3510_cards",
			"memberRow": "_01e9818a87_memberRow",
			"avatar": "_4c90a20e6d_avatar",
			"memberMain": "_022eebeeb7_memberMain",
			"memberNameRow": "_beea31f54f_memberNameRow",
			"memberName": "_4a1dffb879_memberName",
			"memberSub": "_210a5ac276_memberSub",
			"memberBadges": "_c10b1ce8cc_memberBadges",
			"badgeRow": "_a0a437aa69_badgeRow",
			"badge": "_d47a69e244_badge",
			"selfTag": "_e4790a8b2a_selfTag",
			"taskRow": "_3be17ce592_taskRow",
			"taskHead": "_e5072eb997_taskHead",
			"taskId": "_f3c1a56cfa_taskId",
			"taskStatus": "_da4772ff88_taskStatus",
			"taskGoal": "_a0314355fd_taskGoal",
			"taskMeta": "_5ae110ee6e_taskMeta",
			"detail": "_c3770dd1ab_detail",
			"detailBlock": "_9205ad8c11_detailBlock",
			"detailLabel": "_d564c7f262_detailLabel",
			"detailText": "_5a12cc65d6_detailText",
			"criterion": "_507e789171_criterion",
			"criterionMark": "_551b80901b_criterionMark",
			"criterionText": "_c3cd925b04_criterionText",
			"criterionEvidence": "_a294420ff9_criterionEvidence",
			"depLink": "_aa5306563d_depLink",
			"graphScroll": "_d9caa54c3c_graphScroll",
			"graphNode": "_0e52b1affb_graphNode",
			"graphNodeRect": "_48b9ffffd5_graphNodeRect",
			"graphNodeText": "_2872986b90_graphNodeText",
			"graphNodeGhost": "_27734391f5_graphNodeGhost",
			"graphEdge": "_25ef714580_graphEdge",
			"graphHint": "_6ee2d8d6c6_graphHint",
			"inboxRow": "_0211ce1c83_inboxRow",
			"inboxFrom": "_26cf3afb66_inboxFrom",
			"inboxText": "_e5a4beb446_inboxText",
			"emptyWell": "_1eb61a42d6_emptyWell",
			"toolCard": "_497d8d6b65_toolCard",
			"toolCardHead": "_1ecbb9185d_toolCardHead",
			"toolCardTitle": "_02c041d7a6_toolCardTitle",
			"toolCardTo": "_50efcbfdd0_toolCardTo",
			"toolCardBody": "_0486417958_toolCardBody",
			"toolCardPreview": "_4882505683_toolCardPreview",
			"openPanelBtn": "_23b91df096_openPanelBtn",
			"railTab": "_c719fc3016_railTab",
			"railDot": "_094406740c_railDot",
			"railText": "_a0e0d441aa_railText"
		};
		//#endregion
		//#region src/client/panel/YuyiPanel.tsx
		/**
		* 御驿协同活动面板：shell.overlay 浮层里的右缘停靠卡。
		* 头部连接态、概览与分段进度、avatar 主理卡、成员花名册、
		* 任务链进度与详情、依赖 DAG 与停靠消息。数据走注入的
		* Remote 读取面，可见性门控轮询经 onChange 到达；
		* 面板开合状态经共享 store（右缘拉手与会话内卡片同源）。
		* 面板关闭时渲染右缘拉手（对话区域内的常驻入口，不进
		* 宿主标题栏——header.utilities 在桌面壳里与窗口按钮重叠）。
		*/
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
			const dockPresent = useDockPresent();
			if (!open) {
				if (dockPresent) return null;
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
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
			}
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
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: DOT_STATE$1[model.state] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: YuyiPanel_module_css_default.stateLabel,
								"data-state": model.state,
								children: [
									tKey("panel.title"),
									" · ",
									tKey(stateKey(model.state))
								]
							}),
							model.device !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
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
			const positions = /* @__PURE__ */ new Map();
			layout.columns.forEach((column, columnIndex) => {
				column.forEach((node, rowIndex) => {
					positions.set(node.taskId, {
						x: columnIndex * 148,
						y: rowIndex * 38
					});
				});
			});
			const svgWidth = layout.columns.length * 148 - NODE_GAP_X;
			const svgHeight = Math.max(...layout.columns.map((column) => column.length), 1) * 38 - NODE_GAP_Y;
			const active = hot ?? selected;
			const chain = active === void 0 ? void 0 : /* @__PURE__ */ new Set([active, ...hotSet ?? []]);
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
				return;
			} catch {
				return;
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
			const listeners = /* @__PURE__ */ new Set();
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
				return;
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
			const delivered = resultValue(block)?.deliveredAs;
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
			const devices = resultValue(block)?.devices ?? [];
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
			if (typeof user !== "object" || user === null) return /* @__PURE__ */ new Set();
			const record = user;
			return new Set([
				"hub",
				"device",
				"tokenEnv",
				"replyTimeoutMs"
			].filter((field) => record[field] !== void 0));
		}
		//#endregion
		//#region \0dsh-yuyi-css:E:\Development\Code\nodejs\digital-twin\dsh-yuyi\src\client\settings\YuyiSettingsSection.module.css.mjs
		const css = "/* 御驿设置区块：整页框架、状态卡、字段行、页脚动作全部对齐\r\n   产品设置页语义（--dsw-alias-* 令牌 + settings 页的既有度量）。 */\r\n\r\n._1dcf98f3c5_section {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 12px;\r\n  max-width: 720px;\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n._42e438553e_title {\r\n  margin: 0;\r\n  font-size: 18px;\r\n  font-weight: 600;\r\n  line-height: 1.4;\r\n}\r\n\r\n._d22fe221f4_intro {\r\n  margin: 0;\r\n  font-size: 13px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n/* ── 状态卡（产品卡片框架） ─────────────────────────────── */\r\n\r\n._54b61d8796_statusCard {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 8px;\r\n  padding: 14px 16px;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  border-radius: 12px;\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  transition: border-color 0.16s, background 0.16s;\r\n}\r\n\r\n._85550489cb_statusHead {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n  min-width: 0;\r\n}\r\n\r\n._9c48d18863_stateLabel {\r\n  font-size: 13px;\r\n  font-weight: 600;\r\n  line-height: 1.5;\r\n}\r\n\r\n._9c48d18863_stateLabel[data-state='connected'] { color: var(--dsw-alias-state-success-primary); }\r\n._9c48d18863_stateLabel[data-state='disconnected'] { color: var(--dsw-alias-state-warn-primary); }\r\n._9c48d18863_stateLabel[data-state='unconfigured'] { color: var(--dsw-alias-state-error-primary); }\r\n\r\n._da1931a89a_devicePill {\r\n  margin-left: auto;\r\n  max-width: 60%;\r\n  min-width: 0;\r\n}\r\n\r\n._c6014c25f0_deviceName {\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n  font-family: var(--dsw-font-mono, var(--ds-font-family-code, ui-monospace, monospace));\r\n  font-size: 11px;\r\n}\r\n\r\n._40b8a2713c_facts {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 4px;\r\n  margin: 0;\r\n}\r\n\r\n._f81214b15d_fact {\r\n  display: flex;\r\n  gap: 8px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n}\r\n\r\n._0ee5adba4f_factKey {\r\n  flex: none;\r\n  min-width: 56px;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._7eef2a45a5_factValue {\r\n  margin: 0;\r\n  color: var(--dsw-alias-label-secondary);\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n._948f88c8ae_lastError {\r\n  margin: 0;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-state-error-primary);\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n._9db7637f7b_note {\r\n  margin: 0;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n/* ── 字段行（产品 fields 语言：行间细分隔线） ────────────── */\r\n\r\n._e363ea98c2_fields {\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n._dfb68b0352_field {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 6px;\r\n  padding: 12px 0;\r\n}\r\n\r\n._dfb68b0352_field + ._dfb68b0352_field {\r\n  border-top: 1px solid var(--dsw-alias-border-l2);\r\n}\r\n\r\n._ab7af1db68_fieldHead {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n}\r\n\r\n._c581f5cf5d_fieldLabel {\r\n  flex: 1;\r\n  min-width: 0;\r\n  font-size: 13px;\r\n  font-weight: 500;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n._53370da8a1_badges {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n}\r\n\r\n._495d943e24_badge {\r\n  border-radius: 999px;\r\n  padding: 1px 8px;\r\n  font-size: 11px;\r\n  line-height: 17px;\r\n  white-space: nowrap;\r\n  font-weight: 500;\r\n  background: var(--dsw-alias-bg-module-platform);\r\n  color: var(--dsw-alias-label-secondary);\r\n}\r\n\r\n._943ba293b2_badgeMuted {\r\n  border-radius: 999px;\r\n  padding: 1px 8px;\r\n  font-size: 11px;\r\n  line-height: 17px;\r\n  white-space: nowrap;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._8e5c96b4f8_textButton {\r\n  border: none;\r\n  background: none;\r\n  padding: 0;\r\n  font: inherit;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-secondary);\r\n  cursor: pointer;\r\n}\r\n\r\n._8e5c96b4f8_textButton:hover:not(:disabled) {\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n._8e5c96b4f8_textButton:disabled {\r\n  cursor: default;\r\n  opacity: 0.5;\r\n}\r\n\r\n._f265757b21_input {\r\n  height: 34px;\r\n  padding: 0 12px;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  border-radius: 8px;\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  font: inherit;\r\n  font-size: 13px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n._f265757b21_input:focus-visible {\r\n  outline: none;\r\n  border-color: var(--dsw-alias-brand-primary);\r\n}\r\n\r\n._f265757b21_input:disabled {\r\n  color: var(--dsw-alias-label-tertiary);\r\n  cursor: default;\r\n}\r\n\r\n._2ae0282834_inputInvalid {\r\n  height: 34px;\r\n  padding: 0 12px;\r\n  border: 1px solid var(--dsw-alias-state-error-primary);\r\n  border-radius: 8px;\r\n  background: var(--dsw-alias-bg-layer-3);\r\n  font: inherit;\r\n  font-size: 13px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n._2ae0282834_inputInvalid:focus-visible {\r\n  outline: none;\r\n  border-color: var(--dsw-alias-state-error-primary);\r\n}\r\n\r\n._2ae0282834_inputInvalid:disabled {\r\n  color: var(--dsw-alias-label-tertiary);\r\n  cursor: default;\r\n}\r\n\r\n._f1f02a81e3_hint {\r\n  margin: 0;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n._b7f20df883_invalidHint {\r\n  margin: 0;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-state-error-primary);\r\n}\r\n\r\n/* ── 页脚（产品卡片 footer：右对齐 放弃/保存） ────────────── */\r\n\r\n._a866a6e947_footer {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: flex-end;\r\n  gap: 8px;\r\n  padding: 12px 0 4px;\r\n  border-top: 1px solid var(--dsw-alias-border-l2);\r\n}\r\n\r\n._1e9eaa60f3_failed {\r\n  flex: 1;\r\n  min-width: 0;\r\n  margin: 0;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  color: var(--dsw-alias-state-error-primary);\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n._d8c5a82f83_discard,\r\n._a9a8a7acb3_save {\r\n  appearance: none;\r\n  border: 1px solid transparent;\r\n  border-radius: 8px;\r\n  padding: 5px 14px;\r\n  font: inherit;\r\n  font-size: 13px;\r\n  line-height: 1.5;\r\n  cursor: pointer;\r\n}\r\n\r\n._d8c5a82f83_discard {\r\n  border-color: var(--dsw-alias-border-l2);\r\n  background: none;\r\n  color: var(--dsw-alias-label-secondary);\r\n}\r\n\r\n._d8c5a82f83_discard:hover:not(:disabled) {\r\n  color: var(--dsw-alias-label-primary);\r\n  border-color: var(--dsw-alias-label-dimmed);\r\n}\r\n\r\n._a9a8a7acb3_save {\r\n  background: var(--dsw-alias-label-primary);\r\n  color: var(--dsw-alias-bg-layer-3);\r\n}\r\n\r\n._d8c5a82f83_discard:disabled,\r\n._a9a8a7acb3_save:disabled {\r\n  opacity: 0.4;\r\n  cursor: default;\r\n}\r\n\r\n._d8c5a82f83_discard:focus-visible,\r\n._a9a8a7acb3_save:focus-visible {\r\n  outline: 2px solid var(--dsw-alias-brand-primary);\r\n  outline-offset: 1px;\r\n}\r\n";
		const tagId = "dsh-yuyi/YuyiSettingsSection.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-yuyi";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var YuyiSettingsSection_module_css_default = {
			"section": "_1dcf98f3c5_section",
			"title": "_42e438553e_title",
			"intro": "_d22fe221f4_intro",
			"statusCard": "_54b61d8796_statusCard",
			"statusHead": "_85550489cb_statusHead",
			"stateLabel": "_9c48d18863_stateLabel",
			"devicePill": "_da1931a89a_devicePill",
			"deviceName": "_c6014c25f0_deviceName",
			"facts": "_40b8a2713c_facts",
			"fact": "_f81214b15d_fact",
			"factKey": "_0ee5adba4f_factKey",
			"factValue": "_7eef2a45a5_factValue",
			"lastError": "_948f88c8ae_lastError",
			"note": "_9db7637f7b_note",
			"fields": "_e363ea98c2_fields",
			"field": "_dfb68b0352_field",
			"fieldHead": "_ab7af1db68_fieldHead",
			"fieldLabel": "_c581f5cf5d_fieldLabel",
			"badges": "_53370da8a1_badges",
			"badge": "_495d943e24_badge",
			"badgeMuted": "_943ba293b2_badgeMuted",
			"textButton": "_8e5c96b4f8_textButton",
			"input": "_f265757b21_input",
			"inputInvalid": "_2ae0282834_inputInvalid",
			"hint": "_f1f02a81e3_hint",
			"invalidHint": "_b7f20df883_invalidHint",
			"footer": "_a866a6e947_footer",
			"failed": "_1e9eaa60f3_failed",
			"discard": "_d8c5a82f83_discard",
			"save": "_a9a8a7acb3_save"
		};
		//#endregion
		//#region src/client/settings/YuyiSettingsSection.tsx
		/**
		* 御驿设置区块：基于 `yuyi/status`
		* Remote 事件；连接字段走 `yuyi` 设置命名空间，
		* 草稿暂存后由页脚的保存一次性提交（产品插件卡的
		* 交互模型）。令牌按御驿一机多 Agent 的约定是本适配器
		* （dsh）专属的值：经凭证域只写不读地存入宿主凭证库，
		* 区块只报告其存在性，绝不回显。
		*/
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
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: DOT_STATE[connection] }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: YuyiSettingsSection_module_css_default.stateLabel,
										"data-state": connection,
										children: status === void 0 ? t("status.loading") : status.connected ? t("status.connected") : status.configured ? t("status.disconnected") : t("status.unconfigured")
									}),
									status !== void 0 && status.device !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
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
							const invalid = draft !== basis && !draftValid(field, draft);
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
			"configForms"
		];
		/**
		* 客户端插件主体：挂载 Remote 贡献，注册
		* 字典，并注册活动面板、头部工具钮、协同卡片
		* 与设置区块。
		* @param ctx - 客户端根上下文。
		*/
		function apply(ctx) {
			ctx.effect(() => {
				let dispose;
				let active = true;
				ctx.remote.$mount(TYPERT_REMOTE).then((d) => {
					if (!active) {
						d();
						return;
					}
					dispose = d;
				}, (err) => {
					ctx.logger?.error?.("[dsh-yuyi] $mount 失败（remote.yuyi 将不可用）:", err);
				});
				return () => {
					active = false;
					if (typeof dispose === "function") dispose();
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
			ctx.effect(() => {
				if (typeof window === "undefined") return void 0;
				const broadcast = () => {
					try {
						const status = mirror.getSnapshot().current;
						window.dispatchEvent(new CustomEvent("suite-dock:yuyi-status", { detail: {
							configured: status?.configured === true,
							connected: status?.connected === true,
							panelOpen: panelStore.getSnapshot() === true
						} }));
					} catch {}
				};
				const offPanel = panelStore.subscribe(broadcast);
				const offMirror = mirror.subscribe(broadcast);
				const onDockOpen = () => {
					panelStore.open();
				};
				window.addEventListener("suite-dock:yuyi-open", onDockOpen);
				broadcast();
				return () => {
					offPanel();
					offMirror();
					window.removeEventListener("suite-dock:yuyi-open", onDockOpen);
				};
			}, "dsh-yuyi: suite-dock contract");
			ctx.effect(() => mirror.subscribe(() => {
				if (mirror.getSnapshot().current?.configured === true && !panelStore.hasUserChoice()) panelStore.open();
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
			const scope = ctx.configForms.get(YUYI_SETTINGS_NAMESPACE);
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
			const subscribeScope = (notify) => scope.subscribe(notify);
			const subscribeMirror = (notify) => mirror.subscribe(notify);
			const sectionProps = {
				t: sectionT,
				useSettings: function useSettings(selector) {
					return (0, react.useSyncExternalStore)(subscribeScope, () => selector(scope.getSnapshot()));
				},
				useStatus: function useStatus(selector) {
					return (0, react.useSyncExternalStore)(subscribeMirror, () => selector(mirror.getSnapshot()));
				},
				save: async (field, value) => {
					if (!await scope.set(field, value)) throw new Error("保存未生效（配置版本冲突，请重试）");
				},
				reset: async (field) => {
					if (!await scope.unset(field)) throw new Error("还原未生效（配置版本冲突，请重试）");
				},
				token: tokenStore
			};
			ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
				name: "plugins.bundle.config",
				key: "dsh-yuyi"
			}, (props) => {
				if (props.view !== "page") return (0, react.createElement)("span", { style: {
					fontSize: 12,
					color: "var(--dsw-alias-label-secondary)"
				} }, "御驿通信：跨 Agent 寻址、收件箱与任务协作；点开配置 Hub 接入与令牌。");
				return (0, react.createElement)(YuyiSettingsSection, sectionProps);
			}));
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
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map