// using global fetch


const BASE_URL = 'http://127.0.0.1:3000/api';

async function testApi() {
    console.log('Starting API Verification...');

    try {
        // 0. Create Patient
        console.log('\n0. Creating Patient...');
        const patientRes = await fetch(`${BASE_URL}/patients`, { method: 'POST' });
        const patient = await patientRes.json();
        if (!patientRes.ok) throw new Error(JSON.stringify(patient));
        console.log('Patient Created:', patient.id);

        // 1. Create Dot Phrase
        console.log('\n1. Creating Dot Phrase...');
        const phraseRes = await fetch(`${BASE_URL}/dot-phrases`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                triggerKeyword: '.test_' + Date.now(),
                title: 'Test Phrase',
                content: 'This is a test phrase content.'
            })
        });
        const phrase = await phraseRes.json();
        if (!phraseRes.ok) throw new Error(JSON.stringify(phrase));
        console.log('Phrase created:', phrase.id);

        // 2. Create Note with Phrase Link
        console.log('\n2. Creating Note with Phrase Link...');
        const noteRes = await fetch(`${BASE_URL}/procedure-notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                procedureId: '00000000-0000-0000-0000-000000000000',
                patientId: patient.id,
                providerId: '00000000-0000-0000-0000-000000000000',
                content: 'Note content with ' + phrase.triggerKeyword,
                dotPhraseIds: [phrase.id]
            })
        });
        const note = await noteRes.json();
        if (!noteRes.ok) throw new Error(JSON.stringify(note));
        console.log('Note created:', note.id);

        // 3. Update Note (Trigger History)
        console.log('\n3. Updating Note...');
        const updateRes = await fetch(`${BASE_URL}/procedure-notes/${note.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: 'Updated content',
                changedByUserId: '00000000-0000-0000-0000-000000000000'
            })
        });
        const updatedNote = await updateRes.json();
        if (!updateRes.ok) throw new Error(JSON.stringify(updatedNote));
        console.log('Note updated:', updatedNote.content);

        // 4. View History
        console.log('\n4. Viewing History...');
        const histRes = await fetch(`${BASE_URL}/procedure-notes/${note.id}/history`);
        const history = await histRes.json();
        console.log('History entries:', history.length);
        if (history.length > 0) console.log('First entry action:', history[0].actionType);

    } catch (err) {
        console.error('Test Failed:', err);
    }
}

testApi();
