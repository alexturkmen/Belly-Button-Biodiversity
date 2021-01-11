// Breaking the code into 3 functions: creating the charts, writing the demographic info onto the screen and creating a dropdown selection menu

// Building a function to create the plots

function buildPlots(subjectID) {
    // Reading the data
  d3.json("samples.json").then((data) => {
    let samples = data.samples;

    // Filtering the data by subject ID to only bring relevant items from the object

    let sampleInfo = samples.filter((item) => {
        return item.id == subjectID
    });
    let sampleInfoText = sampleInfo[0];
    // console.log(sampleInfo)

    // Defining IDs, labels and values 
    let otuIDs = sampleInfoText.otu_ids;
    let otuLabels = sampleInfoText.otu_labels;
    let sampleValues = sampleInfoText.sample_values;

    let top10otuIDs = otuIDs.slice(0, 10);
    let top10sampleValues = sampleValues.slice(0, 10);
    let top10otuLabels = otuLabels.slice(0, 10);

    // Building the horizontal bar chart

    let traceBar = {
      y: top10otuIDs.map((otuID) => `OTU ${otuID}`).reverse(),
      x: top10sampleValues.reverse(),
      text: top10otuLabels.reverse(),
      type: "bar",
      orientation: "h",
    };

    let dataBar = [traceBar];

    let layoutBar = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 50, l: 100 },
    };

    Plotly.newPlot("bar", dataBar, layoutBar);

    // Building the bubble chart

    let traceBubble = {
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIDs,
        // opacity: otuIDs,
        size: sampleValues,
        colorscale: "Jet"
      },
    };

    let dataBubble = [traceBubble];

    let layoutBubble = {
      margin: { t: 10 },
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Values" },
    //   colorway: otuIDs,
      hovermode: "closest",
    };

    Plotly.newPlot("bubble", dataBubble, layoutBubble);

  });
}

// ********************************************************
// Building a function to write demographic info into a box

function buildData(subjectID) {

    // Reading the data

    d3.json("samples.json").then((data) => {
      let metadata = data.metadata;
    //   console.log(data);
      let demInfo = metadata.filter((item) => {
        return item.id == subjectID;
      });
      //   console.log(demInfo)
      let demInfoText = demInfo[0];
      let demInfoBox = d3.select("#sample-metadata");
      demInfoBox.html("");
      
      // Bringing the demographic info onto the screen in the required format
      Object.entries(demInfoText).forEach(([key, value]) => {
        demInfoBox.append("h5").text(`${key}: ${value}`)
      });
    });
}

// ************************************************************
//Building a function to create the dropdown

function buildDropDown() {

  // Creating a dropdown variable

  let dropDown = d3.select("#selDataset");

  // Using a forEach loop, append the options into #selDataset
  d3.json("samples.json").then((data) => {
    let names = data.names;
    names.forEach((item) => {
      dropDown.append("option").text(item).property("value", item);
    });

   // Creating the plots and demographic data for the first ID
    let firstID = names[0];
    // console.log(names[0])
    buildPlots(firstID);
    buildData(firstID);
    buildGauge(firstID)
  });
}

// ***********************************************************************************
//Building a function to apply the changes to the plots each time dropdown menu changes

function optionChanged(newSample) {
  buildData(newSample);
  buildPlots(newSample);
  buildGauge(newSample)
}

// Creating the charts
buildDropDown();

// Bonus section

function buildGauge(subjectID) {
    d3.json("samples.json").then((data) => {
        let metadata = data.metadata;
      //   console.log(data);
        let demInfo = metadata.filter((item) => {
          return item.id == subjectID;
        });
        //   console.log(demInfo)
        let demInfoText = demInfo[0];

    let wfreq = demInfoText.wfreq
    // console.log(wfreq);

    let dataInd = [
        {
            // domain: { x: [5, 10], y: [5, 10] },
            gauge: { axis: { range: [0, 10] } },
            value: wfreq,
            title: {text: "Belly Button Washing Frequency"},
            type: "indicator",
            mode: "gauge+number"
        }
    ];
    
    var layoutInd = { width: 600, 
        height: 500, 
        margin: { t: 0, b: 0 , l:0},
    };
    Plotly.newPlot('gauge', dataInd, layoutInd);

    })
}

