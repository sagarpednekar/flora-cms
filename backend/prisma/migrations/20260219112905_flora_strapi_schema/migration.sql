/*
  Warnings:

  - You are about to drop the column `description` on the `FloraSpecies` table. All the data in the column will be lost.
  - You are about to drop the column `family` on the `FloraSpecies` table. All the data in the column will be lost.
  - You are about to drop the column `habitat` on the `FloraSpecies` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `FloraSpecies` table. All the data in the column will be lost.
  - You are about to drop the column `is_medicinal` on the `FloraSpecies` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `FloraSpecies` table. All the data in the column will be lost.
  - You are about to drop the column `scientific_name` on the `FloraSpecies` table. All the data in the column will be lost.
  - Added the required column `drug_name` to the `FloraSpecies` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookName" AS ENUM ('Charaka Samhita', 'Sushruta Samhita', 'Ashtang Hridaya', 'Ashtang Samgraha');

-- CreateEnum
CREATE TYPE "Sthana" AS ENUM ('Chikitsa Sthana', 'Indriya Sthana', 'Kalpa Sthana', 'Kalpa siddhi Sthana', 'Kalpana Sthana', 'Nidana Sthana', 'Sharir Sthana', 'Sidhi Sthana', 'Sutra Sthana', 'Uttar Tantra', 'Vimana Sthana');

-- CreateEnum
CREATE TYPE "ChapterNumber" AS ENUM ('Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5', 'Chapter 6', 'Chapter 7', 'Chapter 8', 'Chapter 9', 'Chapter 10', 'Chapter 11', 'Chapter 12', 'Chapter 13', 'Chapter 14', 'Chapter 15', 'Chapter 16', 'Chapter 17', 'Chapter 18', 'Chapter 19', 'Chapter 20', 'Chapter 21', 'Chapter 22', 'Chapter 23', 'Chapter 24', 'Chapter 25', 'Chapter 26', 'Chapter 27', 'Chapter 28', 'Chapter 29', 'Chapter 30', 'Chapter 31', 'Chapter 32', 'Chapter 33', 'Chapter 34', 'Chapter 35', 'Chapter 36', 'Chapter 37', 'Chapter 38', 'Chapter 39', 'Chapter 40', 'Chapter 41', 'Chapter 42', 'Chapter 43', 'Chapter 44', 'Chapter 45', 'Chapter 46', 'Chapter 47', 'Chapter 48', 'Chapter 49', 'Chapter 50');

-- CreateEnum
CREATE TYPE "SingleOrCombinationDrug" AS ENUM ('Single', 'Combination', 'Both', 'Other');

-- CreateEnum
CREATE TYPE "UserExtOrInt" AS ENUM ('INT', 'EXT');

-- AlterTable
ALTER TABLE "FloraSpecies" DROP COLUMN "description",
DROP COLUMN "family",
DROP COLUMN "habitat",
DROP COLUMN "image_url",
DROP COLUMN "is_medicinal",
DROP COLUMN "name",
DROP COLUMN "scientific_name",
ADD COLUMN     "Chapter_number" "ChapterNumber" DEFAULT 'Chapter 1',
ADD COLUMN     "Sthana" "Sthana" DEFAULT 'Chikitsa Sthana',
ADD COLUMN     "anupana" TEXT,
ADD COLUMN     "book_name" "BookName" NOT NULL DEFAULT 'Charaka Samhita',
ADD COLUMN     "drug_name" TEXT NOT NULL,
ADD COLUMN     "formulation_as_a_single_drug" TEXT DEFAULT 'NA',
ADD COLUMN     "formulation_as_combination" TEXT DEFAULT 'NA',
ADD COLUMN     "granthadikara" TEXT,
ADD COLUMN     "latin_name" TEXT,
ADD COLUMN     "name_of_the_combination" TEXT DEFAULT 'NA',
ADD COLUMN     "parenteral_route" TEXT,
ADD COLUMN     "part_of_plant_used" TEXT,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "rogadhikara" TEXT,
ADD COLUMN     "sahapana" TEXT,
ADD COLUMN     "sanskrit_name" TEXT,
ADD COLUMN     "single_or_combination_drug" "SingleOrCombinationDrug" DEFAULT 'Single',
ADD COLUMN     "type_of_ext_use" TEXT,
ADD COLUMN     "user_ext_or_int" "UserExtOrInt" DEFAULT 'INT',
ADD COLUMN     "uses_as_combination" TEXT DEFAULT 'NA',
ADD COLUMN     "uses_as_single_drug" TEXT DEFAULT 'NA',
ADD COLUMN     "verse_number" INTEGER;
