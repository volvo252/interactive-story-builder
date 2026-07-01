import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not configured");
  process.exit(1);
}

let url;

try {
  url = new URL(databaseUrl);
} catch {
  console.error("DATABASE_URL is not a valid URL");
  process.exit(1);
}

const databaseName = url.pathname.slice(1) || "<empty>";
const searchParams = [...url.searchParams.keys()];

console.log("Database connection:");
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