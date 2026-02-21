import { useState, useEffect } from 'react'
import { getJobs, getInfoCandidate, postJob } from "../../services/jobs.service"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const Jobs = () => {
  const [jobs, setJobs] = useState([])
  const [candidate, setCandidate] = useState({})
  const [repoUrls, setRepoUrls] = useState({})
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getJobs().then((data) => {
      setJobs(data)
    }).catch(() => {
      setError(true)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [])

  const handleChange = (jobId, value) => {
    setRepoUrls(prev => ({
      ...prev,
      [jobId]: value
    }));
  };

  const handleSubmit = (job) => {
    const repoUrl = repoUrls[job.id];
    if (!repoUrl) {
      toast.error("Debe ingresar una URL");
      return;
    }
    //expresion regular para direccion de repositorio github
    const githubRegex = /^https:\/\/github\.com\/.+\/.+/;
    if (!githubRegex.test(repoUrl)) {
      toast.error("Debe ser un repositorio válido de GitHub");
      return;
    }

    getInfoCandidate().then((data) => {
      setCandidate(data)
    }).catch((error) => {
      setError(true)
      toast.error(error);
    })

    const dataToSend = {
      uuid: candidate.uuid,
      jobId: job.id,
      candidateId: candidate.candidateId,
      applicationId: candidate.applicationId,
      repoUrl: repoUrl
    };
    
    postJob(dataToSend).then((data) => {
      data.ok ? 
        toast.success("Postulación enviada correctamente") : 
        toast.error("Ocurrio un error inesperado, comuniquese con su administrador")
    }).catch((error) => {
      //console.log("mensaje de error", error);
      toast.error(error.message);
    })
  }

  return (
    <>
      {isLoading && <p>Loading ...</p>}
      {error && <p>Sometimes went wrong</p>}
      {/* <div className={styles.container}> */}
      {!isLoading &&
        <div>
          <h2 className="text-4xl font-bold text-left text-white mb-8">Lista de empleos disponibles</h2>
          <ToastContainer />
          <form >
            <table className="w-full border border-gray-700 text-white border-collapse">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left">N°</th>
                  <th className="px-6 py-4 text-left">Título de la vacante</th>
                  <th className="px-6 py-4 text-left">Repositorio de GitHub</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {jobs?.map((job, index) => (
                  <tr key={job.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4">
                      {index + 1}.-
                    </td >
                    <td className="px-6 py-4 text-left">
                      <p name="job_title" className="text-lg font-semibold">
                        {job.title}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <input
                        type="url"
                        required
                        value={repoUrls[job.id] || ""}
                        onChange={(e) => handleChange(job.id, e.target.value)}
                        placeholder="https://github.com/usuario/repositorio"
                        className="w-full p-2 rounded bg-gray-900 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleSubmit(job)}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                      >
                        Submit
                      </button>
                    </td>
                  </tr>
                ))
                }
              </tbody>
            </table>
          </form >
        </div >
      }

    </>
  )
}

export default Jobs