import { useMemo } from 'react';
import { hex } from 'wcag-contrast';

const fontColors = ['#e6f7fe', '#02364a', '#fce8ec', '#440814'];

export default function useGayContrastColor(otherColor: string) {
    return useMemo(
        () =>
            fontColors.reduce(
                ([c, score], fontColor): [string, number] => {
                    const currentScore = hex(fontColor, otherColor);
                    return currentScore >= score ? [fontColor, currentScore] : [c, score];
                },
                ['', 0] as [string, number]
            )[0],
        [otherColor]
    );
}
