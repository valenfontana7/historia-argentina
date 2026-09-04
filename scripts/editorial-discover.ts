import "dotenv/config";
import { runDiscovery } from "../src/lib/editorial/discovery/orchestrator";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const result = await runDiscovery({ dryRun });
  console.log(JSON.stringify(result, null, 2));
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
