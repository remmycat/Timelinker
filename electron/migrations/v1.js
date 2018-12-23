module.exports = {
    main: old => ({
        ...old,
        'last-opened': (old['last-opened'] || []).map(w => ({
            ...w,
            isOpen: true,
        })),
    }),
};
