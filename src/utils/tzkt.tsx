// Fetch storage of the Smart Contract by completing fetchStorage
import axios from 'axios';

export const fetchStorage = async () => {
    const res = await axios.get(
        'https://api.ghostnet.tzkt.io/v1/contracts/KT1EEE5K3X5reXGKiJ3FKJofPKAdYVgrsW6H/storage'
    );

    return res.data;
};
