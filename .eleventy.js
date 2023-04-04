const dayjs = require('dayjs');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventySass = require("eleventy-sass");

module.exports = function(eleventyConfig){
    // eleventyConfig.addPassthroughCopy("src/assets/css/style.css");
    eleventyConfig.addPassthroughCopy("src/assets/images");

    eleventyConfig.addShortcode(
        "headers",
        (title, subtitle) =>
            `<h1>${title}</h1>
            <p>${subtitle}</p>`
    );

    eleventyConfig.addCollection("page", function(collections) {
        return collections.getFilteredByTag("page").sort(function(a, b) {
            return a.data.order - b.data.order;
        });
    });
    
    eleventyConfig.addFilter('formatDate', function(date, format) {
        return dayjs(date).format(format)
    });

    // PLUGINS
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(eleventySass, {
        sass: {
            loadPaths: ["./node_modules/nord/src/sass/", "./src/assets/scss/"]
          }        
    });

    return {
        dir: {
            input: "src",
            data: "_data",
            includes: "_includes",
            layouts: "_layouts",
            output: "public"
        }
    };
}
