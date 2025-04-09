document.addEventListener("DOMContentLoaded", () => {
    const datasetURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";

    fetch(datasetURL)
        .then(res => res.json())
        .then(data => createTreemap(data));
});

function createTreemap(data) {
    const width = 1000;
    const height = 600;

    const svg = d3.select("#treemap");
    const tooltip = d3.select("#tooltip");

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    d3.treemap()
        .size([width, height])
        .padding(1)(root);

    // Create tiles
    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("class", "tile")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => colorScale(d.data.category))
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .on("mousemove", (event, d) => {
            tooltip
                .style("opacity", 1)
                .html(`${d.data.name}<br>${d.data.category}<br>$${d.data.value}`)
                .attr("data-value", d.data.value)
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 30 + "px");
        })
        .on("mouseout", () => {
            tooltip.style("opacity", 0);
        });

    // Add text labels inside tiles
    svg.selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", d => d.x0 + 4)
        .attr("y", d => d.y0 + 14)
        .text(d => d.data.name)
        .attr("font-size", "10px")
        .attr("fill", "black");

    // Create Legend
    const legend = d3.select("#legend");
    const categories = root.leaves().map(d => d.data.category);
    const uniqueCategories = [...new Set(categories)];

    legend.selectAll(".legend-item")
        .data(uniqueCategories)
        .enter()
        .append("div")
        .attr("class", "legend-item")
        .html(d => `
            <div style="background-color:${colorScale(d)};"></div>
            <span>${d}</span>
        `);
}
