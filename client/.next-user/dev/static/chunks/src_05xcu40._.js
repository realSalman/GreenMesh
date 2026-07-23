(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchGpuMetrics",
    ()=>fetchGpuMetrics,
    "fetchHealth",
    ()=>fetchHealth,
    "fetchModels",
    ()=>fetchModels,
    "fetchThroughputMetrics",
    ()=>fetchThroughputMetrics,
    "getBaseUrl",
    ()=>getBaseUrl,
    "restartRunner",
    ()=>restartRunner,
    "startRunner",
    ()=>startRunner,
    "stopRunner",
    ()=>stopRunner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const getEndpoint = (key, fallback)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        const config = window.FLEXLLAMA_CONFIG;
        if (config && config[key] && !config[key].startsWith('__')) {
            return config[key];
        }
        const devBase = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        return `${devBase}${fallback}`;
    }
    //TURBOPACK unreachable
    ;
};
const getBaseUrl = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        const config = window.FLEXLLAMA_CONFIG;
        if (config && config.HEALTH_ENDPOINT && !config.HEALTH_ENDPOINT.startsWith('__')) {
            return '';
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    }
    //TURBOPACK unreachable
    ;
};
const fetchHealth = async ()=>{
    const url = getEndpoint('HEALTH_ENDPOINT', '/health');
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};
const fetchGpuMetrics = async ()=>{
    const url = getEndpoint('GPU_METRICS_ENDPOINT', '/v1/metrics/gpus');
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};
const fetchThroughputMetrics = async ()=>{
    const url = getEndpoint('THROUGHPUT_METRICS_ENDPOINT', '/v1/metrics/throughput');
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};
const fetchModels = async ()=>{
    const devBase = getBaseUrl();
    const response = await fetch(`${devBase}/v1/models`, {
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};
const startRunner = async (runnerName)=>{
    const devBase = getBaseUrl();
    const response = await fetch(`${devBase}/v1/runners/${encodeURIComponent(runnerName)}/start`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};
const stopRunner = async (runnerName)=>{
    const devBase = getBaseUrl();
    const response = await fetch(`${devBase}/v1/runners/${encodeURIComponent(runnerName)}/stop`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};
const restartRunner = async (runnerName)=>{
    const devBase = getBaseUrl();
    const response = await fetch(`${devBase}/v1/runners/${encodeURIComponent(runnerName)}/restart`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/RunnersList.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RunnersList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function RunnersList({ runners, runnerInfo, modelHealth, onRefresh }) {
    _s();
    const [loadingRunners, setLoadingRunners] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const handleAction = async (runnerName, actionFn, actionName)=>{
        setLoadingRunners((prev)=>({
                ...prev,
                [runnerName]: actionName
            }));
        try {
            await actionFn(runnerName);
            if (onRefresh) await onRefresh();
        } catch (err) {
            console.error(`Failed to ${actionName} runner ${runnerName}:`, err);
            alert(`Error: ${err.message}`);
        } finally{
            setLoadingRunners((prev)=>({
                    ...prev,
                    [runnerName]: null
                }));
        }
    };
    const getRunnerStatusClass = (runnerName)=>{
        const isRunning = runners[runnerName];
        if (!isRunning) return 'error';
        let anyLoading = false;
        Object.entries(modelHealth).forEach(([modelAlias, health])=>{
            const info = runnerInfo[runnerName];
            if (info && info.current_model === modelAlias && health.status === 'loading') {
                anyLoading = true;
            }
        });
        return anyLoading ? 'loading' : 'ok';
    };
    const getRunnerStatusLabel = (runnerName)=>{
        const isRunning = runners[runnerName];
        if (!isRunning) return 'Stopped';
        let anyLoading = false;
        Object.entries(modelHealth).forEach(([modelAlias, health])=>{
            const info = runnerInfo[runnerName];
            if (info && info.current_model === modelAlias && health.status === 'loading') {
                anyLoading = true;
            }
        });
        return anyLoading ? 'Loading' : 'Running';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "section",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "section-title-wrapper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "section-title",
                    children: "Active Clusters"
                }, void 0, false, {
                    fileName: "[project]/src/components/RunnersList.jsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/RunnersList.jsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "runners-grid",
                children: Object.keys(runners).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "unavailable-state",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "unavailable-text",
                        children: "No active clusters configured"
                    }, void 0, false, {
                        fileName: "[project]/src/components/RunnersList.jsx",
                        lineNumber: 60,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/RunnersList.jsx",
                    lineNumber: 59,
                    columnNumber: 11
                }, this) : Object.keys(runners).map((runnerName)=>{
                    const isRunning = runners[runnerName];
                    const info = runnerInfo[runnerName] || {};
                    const statusClass = getRunnerStatusClass(runnerName);
                    const statusLabel = getRunnerStatusLabel(runnerName);
                    const isLoading = loadingRunners[runnerName];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card runner-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "runner-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "runner-title-group",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "runner-name",
                                            children: runnerName
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/RunnersList.jsx",
                                            lineNumber: 74,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/RunnersList.jsx",
                                        lineNumber: 73,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `status-badge ${statusClass}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `status-dot ${statusClass}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/RunnersList.jsx",
                                                lineNumber: 77,
                                                columnNumber: 21
                                            }, this),
                                            statusLabel
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/RunnersList.jsx",
                                        lineNumber: 76,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/RunnersList.jsx",
                                lineNumber: 72,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "runner-meta",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "runner-meta-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "runner-meta-label",
                                                children: "Address:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/RunnersList.jsx",
                                                lineNumber: 83,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "runner-meta-val",
                                                children: info.host ? `${info.host}:${info.port}` : '--'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/RunnersList.jsx",
                                                lineNumber: 84,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/RunnersList.jsx",
                                        lineNumber: 82,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "runner-meta-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "runner-meta-label",
                                                children: "Active Model:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/RunnersList.jsx",
                                                lineNumber: 89,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "runner-meta-val",
                                                children: info.current_model || 'None'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/RunnersList.jsx",
                                                lineNumber: 90,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/RunnersList.jsx",
                                        lineNumber: 88,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "runner-meta-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "runner-meta-label",
                                                children: "Auto-Unload:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/RunnersList.jsx",
                                                lineNumber: 93,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "runner-meta-val",
                                                children: [
                                                    info.auto_unload_timeout_seconds === 0 ? 'Disabled' : `${info.auto_unload_timeout_seconds}s`,
                                                    info.auto_unload_countdown_seconds !== null && info.auto_unload_countdown_seconds !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: '0.75rem',
                                                            marginLeft: '0.25rem',
                                                            color: 'var(--text-secondary)'
                                                        },
                                                        children: [
                                                            "(in ",
                                                            info.auto_unload_countdown_seconds,
                                                            "s)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/RunnersList.jsx",
                                                        lineNumber: 99,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/RunnersList.jsx",
                                                lineNumber: 94,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/RunnersList.jsx",
                                        lineNumber: 92,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/RunnersList.jsx",
                                lineNumber: 81,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "runner-actions",
                                children: !isRunning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-primary",
                                    disabled: isLoading,
                                    onClick: ()=>handleAction(runnerName, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startRunner"], 'starting'),
                                    children: isLoading === 'starting' ? 'Starting...' : 'Start'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/RunnersList.jsx",
                                    lineNumber: 108,
                                    columnNumber: 21
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn btn-danger",
                                            disabled: isLoading,
                                            onClick: ()=>handleAction(runnerName, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopRunner"], 'stopping'),
                                            children: isLoading === 'stopping' ? 'Stopping...' : 'Stop'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/RunnersList.jsx",
                                            lineNumber: 117,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn",
                                            disabled: isLoading,
                                            onClick: ()=>handleAction(runnerName, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["restartRunner"], 'restarting'),
                                            children: isLoading === 'restarting' ? 'Restarting...' : 'Restart'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/RunnersList.jsx",
                                            lineNumber: 124,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/src/components/RunnersList.jsx",
                                lineNumber: 106,
                                columnNumber: 17
                            }, this)
                        ]
                    }, runnerName, true, {
                        fileName: "[project]/src/components/RunnersList.jsx",
                        lineNumber: 71,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/RunnersList.jsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/RunnersList.jsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_s(RunnersList, "4Xr6UZM6opf2/yh28ftEfKEiqn0=");
_c = RunnersList;
var _c;
__turbopack_context__.k.register(_c, "RunnersList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ModelsList.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ModelsList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const STATUS_MAP = {
    ok: {
        label: 'Ready',
        class: 'ok'
    },
    loading: {
        label: 'Loading',
        class: 'loading'
    },
    error: {
        label: 'Error',
        class: 'error'
    },
    not_running: {
        label: 'Not Running',
        class: 'error'
    },
    not_loaded: {
        label: 'Not Loaded',
        class: 'error'
    }
};
function ModelsList({ modelHealth, runnerModels }) {
    const loadedModels = new Set(Object.values(runnerModels).filter(Boolean));
    const modelItems = Object.entries(modelHealth).map(([modelAlias, health])=>{
        return {
            alias: modelAlias,
            health,
            isLoaded: loadedModels.has(modelAlias)
        };
    });
    // Sort model items: loaded first, then status priority, then alphabetical
    modelItems.sort((a, b)=>{
        if (a.isLoaded !== b.isLoaded) {
            return Number(b.isLoaded) - Number(a.isLoaded);
        }
        const statusPriority = {
            ok: 5,
            loading: 4,
            error: 3,
            not_loaded: 2,
            not_running: 1,
            unloaded: 0
        };
        const aPriority = statusPriority[a.health.status] || 0;
        const bPriority = statusPriority[b.health.status] || 0;
        if (aPriority !== bPriority) {
            return bPriority - aPriority;
        }
        return a.alias.localeCompare(b.alias);
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "section",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "section-title-wrapper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "section-title",
                    children: "Available Models"
                }, void 0, false, {
                    fileName: "[project]/src/components/ModelsList.jsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ModelsList.jsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card models-overview-card",
                children: modelItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "unavailable-state",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "unavailable-text",
                        children: "No models available"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ModelsList.jsx",
                        lineNumber: 53,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ModelsList.jsx",
                    lineNumber: 52,
                    columnNumber: 11
                }, this) : modelItems.map((model)=>{
                    const status = model.health.status || 'unloaded';
                    const statusInfo = STATUS_MAP[status] || {
                        label: status,
                        class: 'error'
                    };
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "model-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "model-name",
                                        title: model.alias,
                                        children: model.alias
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ModelsList.jsx",
                                        lineNumber: 63,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '0.75rem',
                                            color: 'var(--text-secondary)',
                                            marginTop: '0.125rem'
                                        },
                                        children: model.health.message || 'No message'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ModelsList.jsx",
                                        lineNumber: 66,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ModelsList.jsx",
                                lineNumber: 62,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    gap: '0.25rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `status-badge ${statusInfo.class}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `status-dot ${statusInfo.class}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ModelsList.jsx",
                                                lineNumber: 72,
                                                columnNumber: 21
                                            }, this),
                                            statusInfo.label
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ModelsList.jsx",
                                        lineNumber: 71,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '0.7rem',
                                            color: 'var(--text-muted)'
                                        },
                                        children: model.isLoaded ? 'Loaded' : 'Idle'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ModelsList.jsx",
                                        lineNumber: 75,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ModelsList.jsx",
                                lineNumber: 70,
                                columnNumber: 17
                            }, this)
                        ]
                    }, model.alias, true, {
                        fileName: "[project]/src/components/ModelsList.jsx",
                        lineNumber: 61,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/ModelsList.jsx",
                lineNumber: 50,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ModelsList.jsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_c = ModelsList;
var _c;
__turbopack_context__.k.register(_c, "ModelsList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatAutoUnloadStatus",
    ()=>formatAutoUnloadStatus,
    "formatMb",
    ()=>formatMb,
    "getTimeDifference",
    ()=>getTimeDifference,
    "slugify",
    ()=>slugify
]);
const slugify = (text)=>{
    return text.toString().trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};
const formatMb = (mb)=>{
    if (mb === null || mb === undefined) return '--';
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${Math.round(mb)} MB`;
};
const formatAutoUnloadStatus = (timeoutSeconds, countdownSeconds)=>{
    if (timeoutSeconds === 0) {
        return 'Disabled';
    }
    let status = `${timeoutSeconds}s`;
    if (countdownSeconds !== null && countdownSeconds !== undefined) {
        if (countdownSeconds <= 0) {
            status += ' (Unloading now...)';
        } else {
            status += ` (Unloading in ${countdownSeconds}s)`;
        }
    }
    return status;
};
const getTimeDifference = (date)=>{
    if (!date) return '--';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 0) return '0s ago';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/MetricsCards.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MetricsCards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
'use client';
;
;
;
// Helper Sparkline Component
function Sparkline({ values, color }) {
    const emptySparkline = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 120 24",
        style: {
            width: '100%',
            height: '100%',
            opacity: 0.3
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
            x1: "0",
            y1: "12",
            x2: "120",
            y2: "12",
            stroke: color,
            strokeWidth: "1"
        }, void 0, false, {
            fileName: "[project]/src/components/MetricsCards.jsx",
            lineNumber: 10,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/MetricsCards.jsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
    if (!values || values.length < 2) return emptySparkline;
    const filtered = values.filter((v)=>v !== null && v !== undefined);
    if (filtered.length < 2) return emptySparkline;
    const min = Math.min(...filtered);
    const max = Math.max(...filtered);
    let range = max - min;
    if (range === 0) range = 1;
    const width = 120;
    const height = 24;
    const padding = 2;
    const step = (width - padding * 2) / (filtered.length - 1);
    const points = filtered.map((value, index)=>{
        const x = padding + index * step;
        const y = height - padding - (value - min) / range * (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const pathD = `M${points.join(' L')}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: `0 0 ${width} ${height}`,
        style: {
            width: '100%',
            height: '100%'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: pathD,
            fill: "none",
            stroke: color,
            strokeWidth: "1.5",
            strokeLinejoin: "round",
            strokeLinecap: "round"
        }, void 0, false, {
            fileName: "[project]/src/components/MetricsCards.jsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/MetricsCards.jsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = Sparkline;
// Helper Throughput Chart Component
function SvgThroughputChart({ genHistory, promptHistory }) {
    const hGen = genHistory || [];
    const hPrompt = promptHistory || [];
    if (hGen.length === 0 && hPrompt.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                fontSize: '0.825rem',
                color: 'var(--text-muted)',
                padding: '1rem 0'
            },
            children: "No historical throughput data yet"
        }, void 0, false, {
            fileName: "[project]/src/components/MetricsCards.jsx",
            lineNumber: 57,
            columnNumber: 12
        }, this);
    }
    const allVals = [
        ...hGen,
        ...hPrompt
    ].filter((v)=>v !== null && v !== undefined);
    const maxVal = allVals.length > 0 ? Math.max(...allVals, 10) : 10;
    const width = 500;
    const height = 100;
    const paddingLeft = 30;
    const paddingRight = 10;
    const paddingTop = 10;
    const paddingBottom = 20;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const getCoordinates = (history)=>{
        if (history.length < 2) return '';
        const step = chartWidth / (history.length - 1);
        return history.map((val, idx)=>{
            const x = paddingLeft + idx * step;
            const y = paddingTop + chartHeight - (val || 0) / maxVal * chartHeight;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' L');
    };
    const genPath = getCoordinates(hGen);
    const promptPath = getCoordinates(hPrompt);
    const gridLines = [];
    const gridCount = 3;
    for(let i = 0; i <= gridCount; i++){
        const yVal = paddingTop + chartHeight / gridCount * i;
        const labelVal = (maxVal - maxVal / gridCount * i).toFixed(0);
        gridLines.push({
            yVal,
            labelVal
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: '100%'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    height: '100px',
                    width: '100%'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    viewBox: `0 0 ${width} ${height}`,
                    style: {
                        width: '100%',
                        height: '100%'
                    },
                    preserveAspectRatio: "none",
                    children: [
                        gridLines.map(({ yVal, labelVal }, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: paddingLeft,
                                        y1: yVal,
                                        x2: width - paddingRight,
                                        y2: yVal,
                                        stroke: "var(--border-light)",
                                        strokeWidth: "0.5",
                                        strokeDasharray: "2,2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/MetricsCards.jsx",
                                        lineNumber: 100,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: paddingLeft - 5,
                                        y: yVal + 3,
                                        fill: "var(--text-muted)",
                                        fontSize: "8",
                                        textAnchor: "end",
                                        fontFamily: "var(--font-sans)",
                                        children: labelVal
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/MetricsCards.jsx",
                                        lineNumber: 109,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, idx, true, {
                                fileName: "[project]/src/components/MetricsCards.jsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this)),
                        promptPath && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: `M${promptPath}`,
                            fill: "none",
                            stroke: "var(--text-muted)",
                            strokeWidth: "1",
                            strokeLinejoin: "round",
                            strokeLinecap: "round",
                            strokeOpacity: "0.7"
                        }, void 0, false, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 123,
                            columnNumber: 13
                        }, this),
                        genPath && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: `M${genPath}`,
                            fill: "none",
                            stroke: "var(--accent-black)",
                            strokeWidth: "1.5",
                            strokeLinejoin: "round",
                            strokeLinecap: "round"
                        }, void 0, false, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/MetricsCards.jsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/MetricsCards.jsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '1rem',
                    fontSize: '0.7rem',
                    marginTop: '0.25rem',
                    color: 'var(--text-secondary)',
                    justifyContent: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    width: '6px',
                                    height: '6px',
                                    backgroundColor: 'var(--accent-black)',
                                    borderRadius: '50%',
                                    display: 'inline-block'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/MetricsCards.jsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, this),
                            "Generation"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/MetricsCards.jsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    width: '6px',
                                    height: '6px',
                                    backgroundColor: 'var(--text-muted)',
                                    borderRadius: '50%',
                                    display: 'inline-block'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/MetricsCards.jsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            "Prompt"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/MetricsCards.jsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/MetricsCards.jsx",
                lineNumber: 146,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/MetricsCards.jsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c1 = SvgThroughputChart;
function MetricsCards({ gpuMetrics, throughputMetrics }) {
    // Build a map of GPU IDs to Runner Names
    const buildGpuRunnerMap = (associations)=>{
        const map = {};
        if (!associations) return map;
        Object.entries(associations).forEach(([runnerName, info])=>{
            let gpuKeys = [];
            if (Array.isArray(info.gpu_ids)) {
                gpuKeys = info.gpu_ids;
            } else if (Array.isArray(info.gpu_indices)) {
                gpuKeys = info.gpu_indices.map((idx)=>String(idx));
            }
            gpuKeys.forEach((gpuKey)=>{
                if (!map[gpuKey]) {
                    map[gpuKey] = [];
                }
                map[gpuKey].push(runnerName);
            });
        });
        return map;
    };
    const gpuRunnerMap = buildGpuRunnerMap(gpuMetrics?.runner_associations);
    const renderGpuSection = ()=>{
        if (!gpuMetrics || gpuMetrics.status !== 'available' || !gpuMetrics.gpus || gpuMetrics.gpus.length === 0) {
            const getReasonText = ()=>{
                if (!gpuMetrics) return 'Loading...';
                const reasonText = {
                    unsupported_platform: 'GPU metrics are not supported on this operating system.',
                    tool_not_found: 'No supported GPU telemetry tool found. Install nvidia-smi and/or amd-smi.',
                    command_failed: 'GPU telemetry command failed. Check driver/tool installation.',
                    command_timeout: 'amd-smi command timed out.',
                    parse_error: 'Failed to parse amd-smi output.',
                    no_visible_gpus: 'No visible GPUs detected.',
                    disabled_in_config: 'GPU metrics collection is disabled in configuration.',
                    fetch_error: 'Could not reach the GPU metrics endpoint.',
                    rate_limited: 'GPU metrics request rate limited.'
                };
                return reasonText[gpuMetrics.reason] || gpuMetrics.collection_error || 'GPU metrics are currently unavailable.';
            };
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "unavailable-state",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "unavailable-icon",
                            children: "⚠️"
                        }, void 0, false, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 206,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "unavailable-text",
                            children: "GPU Metrics Unavailable"
                        }, void 0, false, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 207,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "unavailable-reason",
                            children: getReasonText()
                        }, void 0, false, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 208,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/MetricsCards.jsx",
                    lineNumber: 205,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/MetricsCards.jsx",
                lineNumber: 204,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "gpu-metrics-grid",
            children: gpuMetrics.gpus.map((gpu)=>{
                const idx = gpu.index;
                const gpuKey = gpu.id ? String(gpu.id) : String(idx);
                const name = gpu.name || `GPU ${idx}`;
                const vendor = gpu.vendor || 'unknown';
                const runners = gpuRunnerMap[gpuKey] || gpuRunnerMap[String(idx)] || [];
                const memUsed = gpu.memory_used_mb !== null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMb"])(gpu.memory_used_mb) : '--';
                const memTotal = gpu.memory_total_mb !== null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMb"])(gpu.memory_total_mb) : '--';
                const memPercent = gpu.memory_used_mb != null && gpu.memory_total_mb != null && gpu.memory_total_mb > 0 ? Math.round(gpu.memory_used_mb / gpu.memory_total_mb * 100) : null;
                const util = gpu.utilization_gpu_percent !== null ? `${Math.round(gpu.utilization_gpu_percent)}%` : '--';
                const temp = gpu.temperature_c !== null ? `${Math.round(gpu.temperature_c)}°C` : '--';
                const history = gpuMetrics.gpu_history?.[gpuKey] || {};
                const memHistory = history.memory_used_mb || [];
                const utilHistory = history.utilization_gpu_percent || [];
                const tempHistory = history.temperature_c || [];
                const isMemWarning = memPercent !== null && memPercent > 90;
                const isTempWarning = gpu.temperature_c !== null && gpu.temperature_c > 85;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card gpu-card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "gpu-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "gpu-title",
                                    children: name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/MetricsCards.jsx",
                                    lineNumber: 244,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "gpu-vendor",
                                    children: [
                                        vendor.toUpperCase(),
                                        " GPU ",
                                        idx
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/MetricsCards.jsx",
                                    lineNumber: 245,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 243,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "gpu-metrics-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `gpu-stat ${isMemWarning ? 'metric-warning' : ''}`,
                                    style: {
                                        borderColor: isMemWarning ? 'var(--color-red)' : ''
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "gpu-stat-label",
                                            children: "VRAM"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 249,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "gpu-stat-val",
                                            style: {
                                                fontSize: '0.8rem'
                                            },
                                            children: [
                                                memUsed,
                                                " / ",
                                                memTotal
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 250,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/MetricsCards.jsx",
                                    lineNumber: 248,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "gpu-stat",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "gpu-stat-label",
                                            children: "Utility"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 253,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "gpu-stat-val",
                                            children: util
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 254,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/MetricsCards.jsx",
                                    lineNumber: 252,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `gpu-stat ${isTempWarning ? 'metric-warning' : ''}`,
                                    style: {
                                        borderColor: isTempWarning ? 'var(--color-red)' : ''
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "gpu-stat-label",
                                            children: "Temp"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 257,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "gpu-stat-val",
                                            children: temp
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 258,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/MetricsCards.jsx",
                                    lineNumber: 256,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 247,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "gpu-sparklines",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sparkline-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sparkline-label",
                                            children: "VRAM"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 263,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "sparkline-container",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Sparkline, {
                                                values: memHistory,
                                                color: "var(--accent-black)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/MetricsCards.jsx",
                                                lineNumber: 265,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 264,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/MetricsCards.jsx",
                                    lineNumber: 262,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sparkline-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sparkline-label",
                                            children: "Util"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 269,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "sparkline-container",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Sparkline, {
                                                values: utilHistory,
                                                color: "var(--text-secondary)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/MetricsCards.jsx",
                                                lineNumber: 271,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 270,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/MetricsCards.jsx",
                                    lineNumber: 268,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sparkline-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sparkline-label",
                                            children: "Temp"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 275,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "sparkline-container",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Sparkline, {
                                                values: tempHistory,
                                                color: "var(--text-muted)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/MetricsCards.jsx",
                                                lineNumber: 277,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 276,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/MetricsCards.jsx",
                                    lineNumber: 274,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 261,
                            columnNumber: 15
                        }, this),
                        runners.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                borderTop: '1px solid var(--border-light)',
                                paddingTop: '0.5rem',
                                marginTop: '0.25rem'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Runners:"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/MetricsCards.jsx",
                                    lineNumber: 283,
                                    columnNumber: 19
                                }, this),
                                " ",
                                runners.join(', ')
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 282,
                            columnNumber: 17
                        }, this)
                    ]
                }, gpuKey, true, {
                    fileName: "[project]/src/components/MetricsCards.jsx",
                    lineNumber: 242,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/src/components/MetricsCards.jsx",
            lineNumber: 215,
            columnNumber: 7
        }, this);
    };
    const renderThroughputSection = ()=>{
        if (!throughputMetrics || throughputMetrics.status !== 'available' || !throughputMetrics.models || throughputMetrics.models.length === 0) {
            const getReasonText = ()=>{
                if (!throughputMetrics) return 'Loading...';
                const reasonText = {
                    disabled: 'Token throughput tracking is disabled in configuration.',
                    fetch_error: 'Could not reach the throughput metrics endpoint.',
                    rate_limited: 'Throughput metrics request rate limited.',
                    internal_error: 'The throughput metrics endpoint returned an error.'
                };
                return reasonText[throughputMetrics.reason] || 'No token throughput recorded yet. Charts appear after completions.';
            };
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "unavailable-state",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "unavailable-icon",
                            children: "📊"
                        }, void 0, false, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 309,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "unavailable-text",
                            children: "No Throughput Data"
                        }, void 0, false, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 310,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "unavailable-reason",
                            children: getReasonText()
                        }, void 0, false, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 311,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/MetricsCards.jsx",
                    lineNumber: 308,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/MetricsCards.jsx",
                lineNumber: 307,
                columnNumber: 9
            }, this);
        }
        const history = throughputMetrics.throughput_history || {};
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "throughput-grid",
            children: throughputMetrics.models.map((model)=>{
                const alias = model.alias;
                const modelHistory = history[alias] || {};
                const genHistory = modelHistory.generation_tokens_per_second || [];
                const promptHistory = modelHistory.prompt_tokens_per_second || [];
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card throughput-card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "throughput-card-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "throughput-name",
                                    children: alias
                                }, void 0, false, {
                                    fileName: "[project]/src/components/MetricsCards.jsx",
                                    lineNumber: 330,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "throughput-stats",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "throughput-chip",
                                            children: [
                                                "Avg 1m: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: model.avg_gen_tps_1m !== null ? `${Number(model.avg_gen_tps_1m).toFixed(1)} t/s` : '--'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/MetricsCards.jsx",
                                                    lineNumber: 333,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 332,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "throughput-chip",
                                            children: [
                                                "Peak: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: model.peak_gen_tps !== null ? `${Number(model.peak_gen_tps).toFixed(1)} t/s` : '--'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/MetricsCards.jsx",
                                                    lineNumber: 336,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/MetricsCards.jsx",
                                            lineNumber: 335,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/MetricsCards.jsx",
                                    lineNumber: 331,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 329,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "chart-wrapper",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SvgThroughputChart, {
                                genHistory: genHistory,
                                promptHistory: promptHistory
                            }, void 0, false, {
                                fileName: "[project]/src/components/MetricsCards.jsx",
                                lineNumber: 341,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 340,
                            columnNumber: 15
                        }, this)
                    ]
                }, alias, true, {
                    fileName: "[project]/src/components/MetricsCards.jsx",
                    lineNumber: 328,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/src/components/MetricsCards.jsx",
            lineNumber: 320,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "sections-grid",
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "section",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "section-title-wrapper",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "section-title",
                            children: "GPU Metrics"
                        }, void 0, false, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 354,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/MetricsCards.jsx",
                        lineNumber: 353,
                        columnNumber: 9
                    }, this),
                    renderGpuSection()
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/MetricsCards.jsx",
                lineNumber: 352,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "section",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "section-title-wrapper",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "section-title",
                            children: "Token Throughput"
                        }, void 0, false, {
                            fileName: "[project]/src/components/MetricsCards.jsx",
                            lineNumber: 361,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/MetricsCards.jsx",
                        lineNumber: 360,
                        columnNumber: 9
                    }, this),
                    renderThroughputSection()
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/MetricsCards.jsx",
                lineNumber: 359,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/MetricsCards.jsx",
        lineNumber: 351,
        columnNumber: 5
    }, this);
}
_c2 = MetricsCards;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Sparkline");
__turbopack_context__.k.register(_c1, "SvgThroughputChart");
__turbopack_context__.k.register(_c2, "MetricsCards");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ChatInterface.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatInterface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ChatInterface({ onError }) {
    _s();
    const [models, setModels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeModel, setActiveModel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoadingModels, setIsLoadingModels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isResponding, setIsResponding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const chatHistoryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Load models on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatInterface.useEffect": ()=>{
            loadModels();
        }
    }["ChatInterface.useEffect"], []);
    // Scroll to bottom when messages or response state changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatInterface.useEffect": ()=>{
            if (chatHistoryRef.current) {
                chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
            }
        }
    }["ChatInterface.useEffect"], [
        messages,
        isResponding
    ]);
    const loadModels = async ()=>{
        setIsLoadingModels(true);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchModels"])();
            if (data && data.data) {
                setModels(data.data);
                if (data.data.length > 0) {
                    // If activeModel is not set or not in the new list, select the first one
                    if (!activeModel || !data.data.some((m)=>m.id === activeModel)) {
                        setActiveModel(data.data[0].id);
                    }
                } else {
                    setActiveModel('');
                }
            }
        } catch (err) {
            console.error('Failed to load models:', err);
            if (onError) onError('Failed to load models: ' + err.message);
        } finally{
            setIsLoadingModels(false);
        }
    };
    const handleClear = ()=>{
        setMessages([]);
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const handleInputChange = (e)=>{
        setInput(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };
    const renderMarkdown = (text)=>{
        if (!text) return '';
        // Safety escape
        let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        // Code blocks ```code```
        html = html.replace(/```([\s\S]*?)```/g, (match, code)=>{
            return `<pre><code>${code.trim()}</code></pre>`;
        });
        // Inline code `code`
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        // Bold **bold**
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        // Italic *italic*
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        // Bullet points
        html = html.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        // Line breaks
        html = html.replace(/\n/g, '<br>');
        return html;
    };
    const handleSend = async ()=>{
        if (isResponding) return;
        const content = input.trim();
        if (!content) return;
        if (!activeModel) {
            if (onError) onError('Please select a model to chat with.');
            return;
        }
        setIsResponding(true);
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        const updatedMessages = [
            ...messages,
            {
                role: 'user',
                content
            }
        ];
        setMessages(updatedMessages);
        // Create entry for assistant
        setMessages((prev)=>[
                ...prev,
                {
                    role: 'assistant',
                    content: ''
                }
            ]);
        try {
            const devBase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBaseUrl"])();
            const response = await fetch(`${devBase}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: activeModel,
                    messages: updatedMessages,
                    stream: true
                })
            });
            if (!response.ok) {
                throw new Error(`Inference error: ${response.statusText}`);
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let accumulatedResponse = '';
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, {
                    stream: true
                });
                const lines = chunk.split('\n');
                for (let line of lines){
                    line = line.trim();
                    if (line === 'data: [DONE]') continue;
                    if (line.startsWith('data: ')) {
                        try {
                            const parsed = JSON.parse(line.slice(6));
                            const contentChunk = parsed.choices[0]?.delta?.content || '';
                            accumulatedResponse += contentChunk;
                            // Update last message
                            setMessages((prev)=>{
                                const next = [
                                    ...prev
                                ];
                                if (next.length > 0) {
                                    next[next.length - 1] = {
                                        role: 'assistant',
                                        content: accumulatedResponse
                                    };
                                }
                                return next;
                            });
                        } catch (e) {
                        // Ignore incomplete JSON chunks from stream slicing
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err);
            if (onError) onError('Chat generation failed: ' + err.message);
            setMessages((prev)=>{
                const next = [
                    ...prev
                ];
                if (next.length > 0) {
                    next[next.length - 1] = {
                        role: 'assistant',
                        content: `Error: ${err.message}`,
                        isError: true
                    };
                }
                return next;
            });
        } finally{
            setIsResponding(false);
            setTimeout(()=>{
                if (textareaRef.current) textareaRef.current.focus();
            }, 50);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "chat-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chat-model-selector",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "chatModelSelect",
                                children: "Active Model:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ChatInterface.jsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                id: "chatModelSelect",
                                className: "chat-select",
                                value: activeModel,
                                onChange: (e)=>setActiveModel(e.target.value),
                                disabled: isResponding || isLoadingModels,
                                children: isLoadingModels ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "Loading models..."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ChatInterface.jsx",
                                    lineNumber: 212,
                                    columnNumber: 15
                                }, this) : models.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "No models available. Start a runner."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ChatInterface.jsx",
                                    lineNumber: 214,
                                    columnNumber: 15
                                }, this) : models.map((model)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: model.id,
                                        children: model.id
                                    }, model.id, false, {
                                        fileName: "[project]/src/components/ChatInterface.jsx",
                                        lineNumber: 217,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ChatInterface.jsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                id: "chatRefreshModelsBtn",
                                className: "btn mini-btn",
                                onClick: loadModels,
                                disabled: isResponding || isLoadingModels,
                                title: "Refresh models list",
                                children: "⟳"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ChatInterface.jsx",
                                lineNumber: 223,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ChatInterface.jsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "chatClearBtn",
                        className: "btn mini-btn",
                        onClick: handleClear,
                        disabled: isResponding || messages.length === 0,
                        children: "Clear Chat"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ChatInterface.jsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ChatInterface.jsx",
                lineNumber: 201,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: chatHistoryRef,
                className: "chat-history",
                id: "chatHistory",
                children: messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "chat-welcome",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: 'var(--accent-black)'
                            },
                            children: "💬 Chat Room"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ChatInterface.jsx",
                            lineNumber: 246,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '0.85rem'
                            },
                            children: "Select a model from the list above and start chatting. Responses stream in real-time."
                        }, void 0, false, {
                            fileName: "[project]/src/components/ChatInterface.jsx",
                            lineNumber: 247,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ChatInterface.jsx",
                    lineNumber: 245,
                    columnNumber: 11
                }, this) : messages.map((msg, index)=>{
                    const isUser = msg.role === 'user';
                    const isLastMsg = index === messages.length - 1;
                    const isTyping = isResponding && isLastMsg && !msg.content;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `message ${isUser ? 'user' : 'assistant'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "msg-avatar",
                                children: isUser ? '👤' : '🤖'
                            }, void 0, false, {
                                fileName: "[project]/src/components/ChatInterface.jsx",
                                lineNumber: 257,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "msg-body",
                                children: isTyping ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "typing",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/src/components/ChatInterface.jsx",
                                            lineNumber: 261,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/src/components/ChatInterface.jsx",
                                            lineNumber: 262,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                            fileName: "[project]/src/components/ChatInterface.jsx",
                                            lineNumber: 263,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ChatInterface.jsx",
                                    lineNumber: 260,
                                    columnNumber: 21
                                }, this) : isUser ? msg.content : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        color: msg.isError ? 'var(--color-red)' : 'inherit'
                                    },
                                    dangerouslySetInnerHTML: {
                                        __html: renderMarkdown(msg.content)
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ChatInterface.jsx",
                                    lineNumber: 268,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ChatInterface.jsx",
                                lineNumber: 258,
                                columnNumber: 17
                            }, this)
                        ]
                    }, index, true, {
                        fileName: "[project]/src/components/ChatInterface.jsx",
                        lineNumber: 256,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/ChatInterface.jsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-input-area",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "chat-form",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            ref: textareaRef,
                            id: "chatInput",
                            className: "chat-textarea",
                            placeholder: "Type a message... (Press Enter to send, Shift+Enter for new line)",
                            rows: "1",
                            value: input,
                            onChange: handleInputChange,
                            onKeyDown: handleKeyDown,
                            disabled: isResponding || !activeModel
                        }, void 0, false, {
                            fileName: "[project]/src/components/ChatInterface.jsx",
                            lineNumber: 282,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSend,
                            className: "btn btn-primary",
                            style: {
                                alignSelf: 'flex-end',
                                height: '38px'
                            },
                            disabled: isResponding || !input.trim() || !activeModel,
                            children: "Send"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ChatInterface.jsx",
                            lineNumber: 293,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ChatInterface.jsx",
                    lineNumber: 281,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ChatInterface.jsx",
                lineNumber: 280,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ChatInterface.jsx",
        lineNumber: 200,
        columnNumber: 5
    }, this);
}
_s(ChatInterface, "3mMorFavgYxkAfregdGANjyiXeA=");
_c = ChatInterface;
var _c;
__turbopack_context__.k.register(_c, "ChatInterface");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RunnersList$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/RunnersList.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ModelsList$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ModelsList.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MetricsCards$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/MetricsCards.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ChatInterface$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ChatInterface.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function Page() {
    _s();
    const [isUserDashboard, setIsUserDashboard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Page.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                if ("TURBOPACK compile-time truthy", 1) {
                    setIsUserDashboard(true);
                }
            }
        }
    }["Page.useEffect"], []);
    const [healthData, setHealthData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        runners: {},
        runnerInfo: {},
        modelHealth: {}
    });
    const [gpuMetrics, setGpuMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [throughputMetrics, setThroughputMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFocused, setIsFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Clear error toast helper
    const hideError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Page.useCallback[hideError]": ()=>setError(null)
    }["Page.useCallback[hideError]"], []);
    // Show error helper with auto-hide
    const showError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Page.useCallback[showError]": (msg)=>{
            setError(msg);
        }
    }["Page.useCallback[showError]"], []);
    // Set up auto-dismiss for error toast
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Page.useEffect": ()=>{
            if (error) {
                const timer = setTimeout({
                    "Page.useEffect.timer": ()=>{
                        hideError();
                    }
                }["Page.useEffect.timer"], 5000);
                return ({
                    "Page.useEffect": ()=>clearTimeout(timer)
                })["Page.useEffect"];
            }
        }
    }["Page.useEffect"], [
        error,
        hideError
    ]);
    // Fetch functions
    const loadHealthData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Page.useCallback[loadHealthData]": async ()=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchHealth"])();
                if (data) {
                    setHealthData({
                        runners: data.active_runners || {},
                        runnerInfo: data.runner_info || {},
                        modelHealth: data.model_health || {}
                    });
                    setLastUpdated(new Date());
                    hideError();
                }
            } catch (err) {
                console.error('Error fetching health data:', err);
                showError('Failed to fetch runner data: ' + err.message);
            }
        }
    }["Page.useCallback[loadHealthData]"], [
        hideError,
        showError
    ]);
    const loadGpuMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Page.useCallback[loadGpuMetrics]": async ()=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchGpuMetrics"])();
                if (data) {
                    setGpuMetrics(data);
                }
            } catch (err) {
                console.error('Error fetching GPU metrics:', err);
            // We don't block health updates for GPU errors, but log them
            }
        }
    }["Page.useCallback[loadGpuMetrics]"], []);
    const loadThroughputMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Page.useCallback[loadThroughputMetrics]": async ()=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchThroughputMetrics"])();
                if (data) {
                    setThroughputMetrics(data);
                }
            } catch (err) {
                console.error('Error fetching throughput metrics:', err);
            }
        }
    }["Page.useCallback[loadThroughputMetrics]"], []);
    // Unified refresh trigger
    const refreshAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Page.useCallback[refreshAll]": async ()=>{
            await Promise.all([
                loadHealthData(),
                loadGpuMetrics(),
                loadThroughputMetrics()
            ]);
        }
    }["Page.useCallback[refreshAll]"], [
        loadHealthData,
        loadGpuMetrics,
        loadThroughputMetrics
    ]);
    // Tracks window focus and visibility
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Page.useEffect": ()=>{
            const handleFocus = {
                "Page.useEffect.handleFocus": ()=>setIsFocused(true)
            }["Page.useEffect.handleFocus"];
            const handleBlur = {
                "Page.useEffect.handleBlur": ()=>setIsFocused(false)
            }["Page.useEffect.handleBlur"];
            const handleVisibilityChange = {
                "Page.useEffect.handleVisibilityChange": ()=>{
                    setIsFocused(!document.hidden);
                }
            }["Page.useEffect.handleVisibilityChange"];
            window.addEventListener('focus', handleFocus);
            window.addEventListener('blur', handleBlur);
            document.addEventListener('visibilitychange', handleVisibilityChange);
            return ({
                "Page.useEffect": ()=>{
                    window.removeEventListener('focus', handleFocus);
                    window.removeEventListener('blur', handleBlur);
                    document.removeEventListener('visibilitychange', handleVisibilityChange);
                }
            })["Page.useEffect"];
        }
    }["Page.useEffect"], []);
    // Primary Refresh Loop
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Page.useEffect": ()=>{
            if (isUserDashboard) return; // User dashboard does not poll metrics!
            // Initial fetch
            refreshAll();
            // Only set up interval loop if window/tab is focused
            if (!isFocused) return;
            const intervalId = setInterval({
                "Page.useEffect.intervalId": ()=>{
                    refreshAll();
                }
            }["Page.useEffect.intervalId"], 2000);
            return ({
                "Page.useEffect": ()=>clearInterval(intervalId)
            })["Page.useEffect"];
        }
    }["Page.useEffect"], [
        isFocused,
        refreshAll,
        isUserDashboard
    ]);
    if (isUserDashboard) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "app-container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "header",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "title-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "title-icon",
                                children: "💬"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "title-text",
                                children: "FlexLLama Chat Room"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 144,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 141,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        flexGrow: 1
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ChatInterface$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onError: showError
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 149,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "error-toast",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "⚠️ ",
                                error
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.js",
                            lineNumber: 156,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "error-close",
                            onClick: hideError,
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.js",
                            lineNumber: 157,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.js",
                    lineNumber: 155,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 139,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "app-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "title-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "title-icon",
                                children: "🦙"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "title-text",
                                children: "FlexLLama Admin Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 172,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.25rem'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "indicator",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "pulse-dot"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.js",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '0.75rem',
                                        fontWeight: 500
                                    },
                                    children: "Auto-refresh"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.js",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.js",
                            lineNumber: 176,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 169,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    flexGrow: 1
                },
                children: [
                    lastUpdated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "last-updated",
                        style: {
                            textAlign: 'right',
                            marginTop: '-0.75rem'
                        },
                        children: [
                            "Last updated: ",
                            lastUpdated.toLocaleTimeString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 187,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sections-grid",
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: '2rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: '1fr',
                                    gap: '1.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RunnersList$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        runners: healthData.runners,
                                        runnerInfo: healthData.runnerInfo,
                                        modelHealth: healthData.modelHealth,
                                        onRefresh: refreshAll
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.js",
                                        lineNumber: 195,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ModelsList$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        modelHealth: healthData.modelHealth,
                                        runnerModels: healthData.runnerInfo
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.js",
                                        lineNumber: 202,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 194,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MetricsCards$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                gpuMetrics: gpuMetrics,
                                throughputMetrics: throughputMetrics
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.js",
                                lineNumber: 209,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "error-toast",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "⚠️ ",
                            error
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 219,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "error-close",
                        onClick: hideError,
                        children: "×"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.js",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 218,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.js",
        lineNumber: 167,
        columnNumber: 5
    }, this);
}
_s(Page, "2GmGllpkA29bjaY6ajhq2+LP2wI=");
_c = Page;
var _c;
__turbopack_context__.k.register(_c, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_05xcu40._.js.map