const awsResponse = {
  LabelModelVersion: '2.0',
  Labels: [
    {
      Confidence: 98.24288940429688,
      Instances: [],
      Name: 'Automobile',
      Parents: [{ Name: 'Transportation' }, { Name: 'Vehicle' }],
    },
    {
      Confidence: 98.24288940429688,
      Instances: [
        {
          BoundingBox: {
            Height: 0.23515267670154572,
            Left: 0.4792296290397644,
            Top: 0.11862979829311371,
            Width: 0.10458783805370331,
          },
          Confidence: 98.24288940429688,
        },
        {
          BoundingBox: {
            Height: 0.4367696940898895,
            Left: 0.5198802351951599,
            Top: 0.4165303707122803,
            Width: 0.15560778975486755,
          },
          Confidence: 97.35424041748047,
        },
        {
          BoundingBox: {
            Height: 0.4394041895866394,
            Left: 0.11409731209278107,
            Top: 0.46124595403671265,
            Width: 0.16716930270195007,
          },
          Confidence: 94.69939422607422,
        },
        {
          BoundingBox: {
            Height: 0.48046112060546875,
            Left: 0.5288015007972717,
            Top: 0.4543455243110657,
            Width: 0.23288841545581818,
          },
          Confidence: 89.15740203857422,
        },
        {
          BoundingBox: {
            Height: 0.133291095495224,
            Left: 0.613007664680481,
            Top: 0.11228565126657486,
            Width: 0.04717292636632919,
          },
          Confidence: 82.53941345214844,
        },
        {
          BoundingBox: {
            Height: 0.20213808119297028,
            Left: 0.5217611789703369,
            Top: 0.39069461822509766,
            Width: 0.1083073616027832,
          },
          Confidence: 82.14225769042969,
        },
        {
          BoundingBox: {
            Height: 0.13901376724243164,
            Left: 0.47317832708358765,
            Top: 0.054012004286050797,
            Width: 0.06388425827026367,
          },
          Confidence: 79.24581146240234,
        },
        {
          BoundingBox: {
            Height: 0.1258978694677353,
            Left: 0.526997447013855,
            Top: 0.3814413249492645,
            Width: 0.08517217636108398,
          },
          Confidence: 63.92974090576172,
        },
      ],
      Name: 'Car',
      Parents: [{ Name: 'Transportation' }, { Name: 'Vehicle' }],
    },
    {
      Confidence: 98.24288940429688,
      Instances: [],
      Name: 'Vehicle',
      Parents: [{ Name: 'Transportation' }],
    },
    {
      Confidence: 98.24288940429688,
      Instances: [],
      Name: 'Transportation',
      Parents: [],
    },
    {
      Confidence: 97.47997283935547,
      Instances: [
        {
          BoundingBox: {
            Height: 0.10669837146997452,
            Left: 0.12949931621551514,
            Top: 0.6662736535072327,
            Width: 0.018651675432920456,
          },
          Confidence: 97.47997283935547,
        },
        {
          BoundingBox: {
            Height: 0.07343198359012604,
            Left: 0.5027986764907837,
            Top: 0.2670898735523224,
            Width: 0.017184067517518997,
          },
          Confidence: 94.77205657958984,
        },
        {
          BoundingBox: {
            Height: 0.13185589015483856,
            Left: 0.2149066925048828,
            Top: 0.7583448886871338,
            Width: 0.024310827255249023,
          },
          Confidence: 64.05423736572266,
        },
        {
          BoundingBox: {
            Height: 0.1579471230506897,
            Left: 0.5573673248291016,
            Top: 0.7545992136001587,
            Width: 0.0161913875490427,
          },
          Confidence: 62.191078186035156,
        },
      ],
      Name: 'Wheel',
      Parents: [{ Name: 'Machine' }],
    },
    {
      Confidence: 97.47997283935547,
      Instances: [],
      Name: 'Machine',
      Parents: [],
    },
    {
      Confidence: 82.55280303955078,
      Instances: [],
      Name: 'Parking',
      Parents: [
        { Name: 'Transportation' },
        { Name: 'Car' },
        { Name: 'Vehicle' },
      ],
    },
    {
      Confidence: 82.55280303955078,
      Instances: [],
      Name: 'Parking Lot',
      Parents: [
        { Name: 'Transportation' },
        { Name: 'Car' },
        { Name: 'Vehicle' },
      ],
    },
    { Confidence: 69.26031494140625, Instances: [], Name: 'Road', Parents: [] },
  ],
};

export { awsResponse };

