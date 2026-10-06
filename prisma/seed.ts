import "dotenv/config";
import { syncDemoListingsToDatabase } from "@/lib/sync-demo-listings";

const main = async () => {
  await syncDemoListingsToDatabase();
};

main()
  .then(() => {
    process.stdout.write("Demo listings synchronized successfully.\n");
  })
  .catch((error) => {
    console.error(error);
    process.stderr.write(
      `Seed failed ${error instanceof Error ? error.message : String(error)} \n`,
    );
    process.exit(1);
  });
