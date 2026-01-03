/*
  Warnings:

  - You are about to drop the `_BookingToTicket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_BookingToTicket";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "BookingTicketJoin" (
    "bookingId" INTEGER NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    PRIMARY KEY ("bookingId", "ticketId"),
    CONSTRAINT "BookingTicketJoin_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookingTicketJoin_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
