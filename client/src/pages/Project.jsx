import { useMemo, useState, useEffect,useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Navbar from '../components/layout/Navbar';
import { useDispatch,useSelector } from 'react-redux';
import {fetchProjects,createProject,toggleProjectStatus,updateProject,deleteProject} from '../features/project/projectThunks';
import { clearMessages } from '../features/project/projectSlice';
import { fetchMembers } from '../features/member/memberThunks';
import loader from '../assets/loader.gif';

const Project = () => {
  const dispatch = useDispatch();
  const {projects,loading,errorMessage,successMessage} = useSelector((state)=>state.project);
  const {members,loading_member} = useSelector((state)=>state.members)
  const [formData,setFormData] = useState({});
  const [formError, setFormError] = useState({ name: '', description: '' });
  const [formEditMode, setFormEditMode] = useState(false);
  const closeButtonRef = useRef(null); 
  const openModalRef = useRef(null); 


  useEffect(()=>{
    dispatch(fetchProjects());
  },[dispatch])

    useEffect(()=>{
    dispatch(fetchMembers());
  },[])

  /* UseEffect for handle message for preview or reset using redux*/
  useEffect(() => {
    console.log("successMessage:- ",successMessage)
    if (successMessage) {
        toast.success(successMessage);
        dispatch(clearMessages());
    }
    if (errorMessage) {
        toast.error(errorMessage);
        dispatch(clearMessages());
    }
  }, [successMessage, errorMessage]);

  const handleValidation = (field = 'all') => {
      let errors = { ...formError };
      let isError = false;

      if (field === 'all' || field === 'name') {
        if (!formData.name || formData.name.trim() === '') {
          errors.name = 'Enter project name';
          isError = true;
        }
        else {
          errors.name = '';
        }
      }

      if (field === 'all' || field === 'description') {
        if (!formData.description || formData.description.trim() === '') {
          errors.description = 'Enter description';
          isError = true;
        }else {
          errors.description = '';
        }
      }

      setFormError(errors);
      return isError; // true means there's an error
  }

  const handleSaveProject = async () => {
      const isValidate = handleValidation();
      if (!isValidate) {
          if (formEditMode) {
              await dispatch(updateProject(formData));
          } else {
              await dispatch(createProject(formData));
          }
          closeModal();
          dispatch(fetchProjects());
      }
  };

  const handleToggleStatus = async (id,status)=>{
      // console.log("Updating...",id,status);
      // const updatedData = {id,status};
      await dispatch(toggleProjectStatus({id,status}));
  }

  const closeModal = () => {
      closeButtonRef.current?.click();
      resetForm();
  };

  const resetForm = async ()=>{
      await setFormData({});
      await setFormError({ name: '', description: '',assignedMembers:[] });
  }

  const openCreateModal = () => {
    // setFormData({ name: '', description: '' });
    
    resetForm();
    // console.log(formData)
    setFormEditMode(false);
   
  };

  const openEditModal = (project) => {
    // console.log("project:- ",project);
    resetForm();
    // console.log(formData)
    setFormData({ _id:project._id,name: project.name, description: project.description,assignedMembers:project.assignedMembers.map(member => member._id)});
    setFormEditMode(true);
  };

  const handleDeleteProject = (id) => {
    Swal.fire({
      title: 'Are you sure?',text: "You won't be able to revert this!",icon: 'warning',showCancelButton: true,confirmButtonColor: '#d33',cancelButtonColor: '#3085d6',confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
          await dispatch(deleteProject(id));
      }
    });
  };

  const columns = useMemo(() => [
    {
      accessorKey: '_id',
      header: '#Sr No',
      size: 80,
      Cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'name',
      header: 'Project Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
   {
      header: 'Assign Members',
      Cell: ({ row }) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
          {row.original.assignedMembers && row.original.assignedMembers.length > 0 ? (
            row.original.assignedMembers.map((member) => (
              <span key={member._id} className="badge bg-light text-dark" style={{border:'1px solid grey'}}>
                {member.firstname} | {member.role.toUpperCase()}
              </span>
            ))) 
            : 
            (<span className="text-muted">No Members</span>)
          }

          {/* <button className="btn btn-sm btn-outline-secondary ms-2">
            + Assign
          </button> */}
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status ',
      Cell: ({ cell }) => (
        <span className={`badge ${cell.getValue() ? 'bg-success' : 'bg-danger'}`}>
          {cell.getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
    },
      {
      accessorKey: 'createdBy',
      header: 'Created By',
      Cell: ({ cell }) =><>{cell.getValue().firstname} {cell.getValue().lastname}</>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
    },
    {
      accessorKey: 'Actions',
      header: 'Actions',
      Cell: ({ row }) =>{

          const { _id, isActive } = row.original;
           return (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div className="form-check form-switch d-flex align-items-center">
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={isActive}
                     onChange={()=>handleToggleStatus(_id,!isActive)} style={{transform: 'scale(1.1)',marginRight: '10px',cursor: 'pointer'}}/>
              </div>
              <span style={{color: "lightgrey"}}>|</span>
              <span className="text-primary cursor-pointer" style={{fontWeight:'500',cursor: 'pointer'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>openEditModal(row.original)}>
                Edit
              </span>
              <span className="text-danger" style={{fontWeight:'500',cursor: 'pointer'}} onClick={() => handleDeleteProject(row.original._id)}>
                Delete
              </span>
            </div>
          );
      },
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: projects,
    state: { isLoading: loading },
    enableColumnFilters: false,
    enableSorting: true,
    enablePagination: true,
    initialState: { pagination: { pageSize: 5 } },
  });

  console.log("formData:- ",formData);
  return (
    <>
      <Navbar />
      <section className="container-fluid" style={{marginTop:"50px"}}>
        <h2 className='mx-3'>Projects</h2>
        <div className="mx-3 d-flex align-items-center mt-5 justify-content-end mb-5" style={{ columnGap: "10px" }}>
    
          <div className="dropdown">
            <button className="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{ backgroundColor: "#22218b",width: "130px",padding: "0px", height: "40px" }} onClick={openCreateModal}>
              Add Project
              {/* {
                 (btnLoading)
                 ?
                     <div className='loader-container' style={{height:"100%"}}>
                        <img src={btnLoader} alt="" style={{height: "95%"}}/>
                      </div>
                 :
                 "Transfer To"
              } */}
            </button>
           
          </div>
        </div>
        {
           (loading)
           ?
              <div className='loader-container' style={{height:"70vh"}}>
                 <img src={loader} alt="" style={{height:"70px"}}/>
              </div>
           :
              <MaterialReactTable table={table} className="" />
        }
      
        <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            
        />

          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{ formEditMode ? 'Edit Project' : 'Create Project'}</h5>
                </div>

                <div className="modal-body" style={{ minHeight: "300px", padding: "2rem" }} key={formEditMode ? 'create' : 'edit'}>
                  {/* Project Name */}
                  <div className="mb-3">
                    <label className='field-lab'>Project Name</label>
                    <input
                      type="text"
                      className={`form-control field-val ${formError.name ? 'form-input-error' : ''}`}
                      placeholder="Enter project name"
                      value={formData?.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {formError.name && <span className="form-label-error d-block mt-1">{formError.name}</span>}
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className='field-lab'>Description</label>
                    <textarea
                      className={`form-control ${formError.description ? 'form-input-error' : ''}`}
                      rows="3"
                      placeholder="Enter description"
                      value={formData?.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                    {formError.description && <span className="form-label-error d-block mt-1">{formError.description}</span>}
                  </div>

                  {/* Assign Members */}
                  <div className="mb-3">
                    <label className='field-lab'>Assign To Members</label>
                    <select 
                      className="form-select"
                      size="3"
                      multiple
                      value={formData?.assignedMembers}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                        setFormData({ ...formData, assignedMembers: selectedOptions });
                      }}
                    > 
                      {members?.map(user => (
                        <option key={user._id} value={user._id}>
                          {user.firstname} - ({user.role.toUpperCase()})
                        </option>
                      ))}
                    </select>
                    {/* <small className="text-muted">Hold Ctrl (Windows) or Command (Mac) to select multiple users.</small> */}
                  </div>
                </div>

               <div className="modal-footer d-flex">
                  <button type="button" className="btn btn-secondary" id="close-btn-modal" data-bs-dismiss="modal" style={{color:"#6c757d",backgroundColor:"transparent"}} ref={closeButtonRef}>Close</button>
                  <button type="button" className="btn btn-primary" id="save-btn-modal" style={{backgroundColor:"#22218b",width:"80px",padding: "0px",height: "37px"}} onClick={()=>handleSaveProject()}>
                    {/* {
                          (btnLoading)
                          ?
                              <div className='loader-container' style={{height:"100%"}}>
                                <img src={btnLoader} alt="" style={{height: "100%"}}/>
                              </div>
                          :
                          "Save"
                    } */}
                    Save
                  </button>
              </div>
              </div>
            </div>
          </div>


      </section>
    </>
  );

};

export default Project;
