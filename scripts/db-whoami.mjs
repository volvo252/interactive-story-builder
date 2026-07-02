import "dotenv/config";

const runtimeUrl = process.env.DATABASE_URL;
const prismaCliUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

function printConnectionSummary(label, value) {
  if (!value) {
    console.error(`${label} is not configured`);
    process.exit(1);
  }

  let url;

  try {
    url = new URL(value);
  } catch {
    console.error(`${label} is not a valid URL`);
    process.exit(1);
  }

  const databaseName = url.pathname.slice(1) || "<empty>";
  const searchParams = [...url.searchParams.keys()];

  console.log(label);
  console.log("protocol:", url.protocol);
  console.log("user:", url.username || "<empty>");
  console.log("password:", url.password ? "<hidden>" : "<empty>");
  console.log("host:", url.hostname || "<empty>");
  console.log("port:", url.port || "<default>");
  console.log("database:", databaseName);
  console.log(
    "params:",
    searchParams.length > 0 ? searchParams.join(", ") : "<none>",
  );
  console.log("");
}

printConnectionSummary("Runtime DATABASE_URL", runtimeUrl);
printConnectionSummary("Prisma CLI URL", prismaCliUrl);
