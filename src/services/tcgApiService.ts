// services/tcgApiService.ts

export interface TcgCard {
    id: string;
    name: string;
    supertype: string;
    subtypes: string[];
    images: {
        small: string;
        large: string;
    };
    tcgplayer?: {
        url: string;
        prices: {
            holofoil?: { market: number };
            normal?: { market: number };
            reverseHolofoil?: { market: number };
        };
    };
    set: {
        name: string;
        series: string;
    };
    rarity: string;
    number: string;
}

const API_URL = 'https://api.pokemontcg.io/v2/cards';

export const tcgApiService = {
    async getRandomCards(count: number = 10): Promise<TcgCard[]> {
        // Random page choice to get different cards (approx 15000 cards total, page size 10 -> 1500 pages)
        // We'll pick a random page between 1 and 100 to ensure high quality modern cards usually
        // Random page choice to get different cards
        const page = Math.floor(Math.random() * 50) + 1;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        try {
            const response = await fetch(`${API_URL}?page=${page}&pageSize=${count}&q=supertype:pokemon`, {
                method: 'GET',
                signal: controller.signal
                // Removed empty API key header to avoid potential issues
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching external TCG cards:', error);
            return [];
        }
    }
};
