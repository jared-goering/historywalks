/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude SparkJS from server-side bundling
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("@sparkjsdev/spark");
    }

    // SparkJS uses `new URL("data:application/wasm;base64,…", import.meta.url)`
    // which webpack 5 processes through asset modules. Next.js sets a global
    // generator with `filename` for asset types, but `asset/inline` only
    // accepts `dataUrl`, causing a schema validation error.
    //
    // Fix: remove `filename` from the `asset/inline` generator entry.
    if (config.module?.generator?.["asset/inline"]?.filename) {
      delete config.module.generator["asset/inline"].filename;
    }

    // Also remove from any catch-all `asset` generator that would cascade
    // down to asset/inline
    if (config.module?.generator?.asset?.filename) {
      // Move the filename to asset/resource only (which supports it)
      const fn = config.module.generator.asset.filename;
      delete config.module.generator.asset.filename;
      config.module.generator["asset/resource"] = {
        ...config.module.generator["asset/resource"],
        filename: fn,
      };
    }

    // Walk rules to fix any rule-level generator conflicts
    function fixRules(rules) {
      if (!rules) return;
      for (const rule of rules) {
        if (rule?.type === "asset/inline" && rule.generator?.filename) {
          delete rule.generator.filename;
        }
        if (rule?.oneOf) fixRules(rule.oneOf);
        if (rule?.rules) fixRules(rule.rules);
      }
    }
    fixRules(config.module?.rules);

    return config;
  },
};

export default nextConfig;
