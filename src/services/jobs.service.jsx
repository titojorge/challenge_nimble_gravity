export const getInfoCandidate = async () => {
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const EMAIL_CANDIDATE = import.meta.env.VITE_EMAIL_CANDIDATE;
        const response = await fetch(`${API_URL}/api/candidate/get-by-email?email=${EMAIL_CANDIDATE}`)
        if (response) {
            const data = await response.json()
            return data
        } else {
            throw new Error('Failed to fetch information candidate')
        }
    } catch (error) {
        throw new Error('Network error', error)
    }
}

export const getJobs = async () => {
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/api/jobs/get-list`)
        if (response) {
            const data = await response.json()
            return data
        } else {
            throw new Error('Failed to fetch jobs')
        }
    } catch (error) {
        throw new Error('Network error', error)
    }
}

export const postJob = async (dataToSend) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/api/candidate/apply-to-job`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to apply to job');
    }

    return data;
}