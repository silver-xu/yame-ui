export const isElementInViewport = (
    el: Element,
    topOffset: number = 0
): boolean => {
    const rect = el.getBoundingClientRect();

    return (
        rect.top >= topOffset &&
        rect.left >= 0 &&
        rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
    );
};
