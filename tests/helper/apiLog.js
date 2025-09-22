
export async function attachApiJson(testInfo, name, response) {
  const text = await response.text();
  let pretty = text;
  try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch {}
  await testInfo.attach(`${name}.json`, {
    body: Buffer.from(pretty, 'utf-8'),
    contentType: 'application/json',
  });
  return pretty; 
}
