module.exports = {
    main: old => ({
        ...old,
        'last-opened': (old['last-opened'] || []).map((w, i) => ({
            ...w,
            isOpen_changed: w.isOpen_changed || new Date(i),
            // set to unix time 0 + index to support old index based sort.
        })),
    }),
};
