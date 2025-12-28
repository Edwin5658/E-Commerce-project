// initialize
npx prisma init --db --output ../src/generated/prisma

// run migration to create tables
npx prisma migrate dev --name init

// generate Prisma Client
npx prisma generate

// Prisma seed db
npx prisma db seed
