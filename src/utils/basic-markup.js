//
//  basic-markup.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-30.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

const convertBasicMarkup = (input, allowHtml) => {
    let strongRe = /[*]{2}([^*]+)[*]{2}/gm;
    let emRe = /[*]([^*]+)[*]{1}/gm;
    let linkRe = /\[([^\]]*)\]\(([^\)]*?)\)/gm;
    let nlRe = /\r\n/gm;
    let crRe = /\r/gm;

    // special re's to revert linebreaks from <br />
    let codeRe = /(<code\b[^>]*>(.*?)<\/code>)/gm;

    // cleanup newlines
    input = input.replace(nlRe, "\n");
    input = input.replace(crRe, "\n");

    // strip existing html before inserting breaks/markup
    if (!allowHtml) {
        // strip html
        input = input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // convert newlines to breaks
    input = input.replace(/\n/gm, '<br />');

    // replace basic markup
    input = input.replace(strongRe, function (whole, m1) {
        return '<strong>' + m1 + '</strong>';
    });

    input = input.replace(emRe, function (whole, m1) {
        return '<em>' + m1 + '</em>';
    });

    input = input.replace(linkRe, function (whole, m1, m2) {
        // fix up protocol
        if (!m2.match(/(http(s?)|ftp(s?)):\/\//gm))
            // prepend http as default
            m2 = 'http://' + m2;
        return '<a href=\"' + m2 + '\" target=\"_blank\">' + m1 + '</a>';
    });

    // revert code blocks
    input = input.replace(codeRe, function (whole, m1) {
        return m1.replace(/<br \/>/gm, '\n');
    });

    return input;
};

export default convertBasicMarkup;