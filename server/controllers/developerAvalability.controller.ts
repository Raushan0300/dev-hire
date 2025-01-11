
export const developerAvailabilityController = async (req: Request, res: Response) => {
    const {availability,} = req.body;
    const {id,role} =req.body.user;
    const newDeveloper = new DeveloperProfile({
        email,
        fullName,
        title,
        hourlyRate: hourlyRate * 10000,
        walletAddress,
        

    });
    try {
        const developer = await developerUser.findById(req.userId);
        if (!developer) {
            res.status(400).json({ message: "User does not exist" });
            return;
        }

        developer.availability = req.body.availability;
        await developer.save();

        res.json({ message: "Availability updated" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        return;
    }
};