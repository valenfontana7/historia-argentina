import "dotenv/config";
import { runAutopilot } from "../src/lib/editorial/autopilot/pipeline";
import { prisma } from "../src/lib/db";

async function main() {
  const storyId = process.argv[2];
  if (!storyId) {
    console.error("Usage: editorial-autopilot.ts <storyId>");
    process.exit(1);
  }
  const result = await runAutopilot(storyId);
  console.log(JSON.stringify(result, null, 2));
}

void main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
