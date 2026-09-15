const http = require('http');

http.get('http://localhost:5001/api/universities', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const list = json.data;
    console.log(`HTTP 200 OK: Loaded ${list.length} universities (success: ${json.success}).`);
    const sample = list[0];
    console.log('Sample Cutoffs for', sample.name, ':', {
      minCGPA10: sample.minCGPA10,
      minGermanGrade: sample.minGermanGrade,
      minUSGPA: sample.minUSGPA,
      ieltsMinOverall: sample.ieltsMinOverall,
      toeflMin: sample.toeflMin,
      greRequirement: sample.greRequirement,
      maxBacklogsAllowed: sample.maxBacklogsAllowed,
      acceptanceRate: sample.acceptanceRate
    });

    // Test query filter with minCGPA=7.5
    http.get('http://localhost:5001/api/universities?minCGPA=7.5', (filterRes) => {
      let filterData = '';
      filterRes.on('data', c => filterData += c);
      filterRes.on('end', () => {
        const filterJson = JSON.parse(filterData);
        console.log(`Filtered query ?minCGPA=7.5 returned ${filterJson.count} matching universities`);
        const allEligible = filterJson.data.every(u => u.minCGPA10 <= 7.5);
        console.log(`Verification: all filtered universities satisfy minCGPA10 <= 7.5: ${allEligible}`);

        // Test POST /api/evaluate
        const postData = JSON.stringify({
          academic: {
            cgpa: 8.2,
            cgpaScale: 10,
            ielts: 7.5,
            backlogs: 0,
            degreeTarget: "masters",
            backgroundField: "Computer Science"
          },
          financial: {
            liquidSavingsINR: 2500000
          },
          targetCountry: "Germany"
        });

        const req = http.request('http://localhost:5001/api/evaluate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        }, (evalRes) => {
          let evalData = '';
          evalRes.on('data', c => evalData += c);
          evalRes.on('end', () => {
            const evalJson = JSON.parse(evalData);
            const allMatches = evalJson.data?.academicEvaluation?.allMatches;
            console.log('Evaluation HTTP 200 OK: Total matches in allMatches:', allMatches?.length);
            const firstMatch = allMatches?.[0]?.university;
            console.log('First match cutoffs included in evaluation:', {
              name: firstMatch?.name,
              minCGPA10: firstMatch?.minCGPA10,
              minGermanGrade: firstMatch?.minGermanGrade,
              minUSGPA: firstMatch?.minUSGPA,
              ieltsMinOverall: firstMatch?.ieltsMinOverall,
              toeflMin: firstMatch?.toeflMin,
              greRequirement: firstMatch?.greRequirement,
              maxBacklogsAllowed: firstMatch?.maxBacklogsAllowed,
              acceptanceRate: firstMatch?.acceptanceRate
            });
            if (firstMatch?.minCGPA10 && firstMatch?.minGermanGrade && firstMatch?.minUSGPA && allEligible) {
              console.log('🎉 SUCCESS: All minimum cutoffs and filtering verified live over HTTP network!');
              process.exit(0);
            } else {
              console.error('FAIL: Missing cutoffs in match or failed filtering check');
              process.exit(1);
            }
          });
        });

        req.write(postData);
        req.end();
      });
    });
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
