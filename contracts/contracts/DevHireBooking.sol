// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DevHireBooking {
    address public owner;
    mapping(bytes32 => Booking) public bookings;

    struct Booking {
        address client;
        address developer;
        uint256 amount;
        bool isPaid;
        bool isCompleted;
        bool isRefunded;
    }

    event BookingCreated(bytes32 bookingId, address client, address developer, uint256 amount);
    event BookingCompleted(bytes32 bookingId);
    event BookingRefunded(bytes32 bookingId);

    constructor() {
        owner = msg.sender;
    }

    function createBooking(bytes32 bookingId, address developer) external payable {
        require(msg.value > 0, "Payment required");
        require(bookings[bookingId].client == address(0), "Booking exists");

        bookings[bookingId] = Booking({
            client: msg.sender,
            developer: developer,
            amount: msg.value,
            isPaid: true,
            isCompleted: false,
            isRefunded: false
        });

        emit BookingCreated(bookingId, msg.sender, developer, msg.value);
    }

    function completeBooking(bytes32 bookingId) external {
        Booking storage booking = bookings[bookingId];
        require(msg.sender == owner, "Only owner");
        require(booking.isPaid, "Not paid");
        require(!booking.isCompleted, "Already completed");

        booking.isCompleted = true;
        payable(booking.developer).transfer(booking.amount);
        emit BookingCompleted(bookingId);
    }

    function refundBooking(bytes32 bookingId) external {
        Booking storage booking = bookings[bookingId];
        require(msg.sender == owner, "Only owner");
        require(booking.isPaid, "Not paid");
        require(!booking.isCompleted, "Already completed");
        require(!booking.isRefunded, "Already refunded");

        booking.isRefunded = true;
        payable(booking.client).transfer(booking.amount);
        emit BookingRefunded(bookingId);
    }
}