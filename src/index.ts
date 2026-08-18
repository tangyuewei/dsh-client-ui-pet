/**
 * @deepseek-ai/dsh-client-ui-salted-fish-pet – Node entry (empty host behavior).
 *
 * Pure UI overlay plugin: the browser half ships via exports["./client"]
 * (discovered through the package.json `dsh.client` declaration). This host
 * entry only exists so the plugin is a valid Cordis plugin in the loader /
 * host cordis.yml tree — it intentionally does nothing server-side.
 */

/** Host plugin body — no host-side behavior for this surface plugin. */
export function apply(): void {}
