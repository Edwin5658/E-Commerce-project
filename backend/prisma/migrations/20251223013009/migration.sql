/*
  Warnings:

  - You are about to drop the column `total_price` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cartItem_id` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "product"."Product_cartItem_id_key";

-- AlterTable
ALTER TABLE "order"."Order" DROP COLUMN "total_price";

-- AlterTable
ALTER TABLE "product"."Product" DROP COLUMN "cartItem_id";
