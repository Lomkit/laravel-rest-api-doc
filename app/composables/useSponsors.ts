export const useSponsors = () => {
    const sponsors = [{
        name: 'XEFI',
        text: 'French leader in IT performance support',
        logo: {
            light: '/sponsors/xefi-light.png',
            dark: '/sponsors/xefi-dark.png',
        },
        link: 'https://xefi.com'
    }]

    function getRandomElement<T>(arr: T[]): T | undefined {
        if (arr.length === 0) {
            return undefined;
        }

        const randomIndex = Math.floor(Math.random() * arr.length);

        return arr[randomIndex];
    }

    return computed(() => getRandomElement(sponsors));
}