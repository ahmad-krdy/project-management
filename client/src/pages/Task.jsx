import { useMemo, useState, useEffect,useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Navbar from '../components/layout/Navbar';
import { useDispatch,useSelector } from 'react-redux';
import {fetchProjects} from '../features/project/projectThunks';
import { fetchTasks,createTask,toggleTaskstatus,updateTask,deleteTask,updateTaskProgress } from '../features/task/taskThunk';
import { clearMessages } from '../features/task/taskSlice';
import { fetchMembers } from '../features/member/memberThunks';
import loader from '../assets/loader.gif';

const Task = () => {
  const dispatch = useDispatch();
  const {projects} = useSelector((state)=>state.project);
  const {user} = useSelector((state)=>state.auth);
  const {tasks,task_loading,errorMessage,successMessage} = useSelector((state)=>state.task);
  const {members,loading_member} = useSelector((state)=>state.members)
  const [formData,setFormData] = useState({});
  const [formError, setFormError] = useState({ name: '', description: '' });
  const [formEditMode, setFormEditMode] = useState(false);
  const closeButtonRef = useRef(null); 
  const openModalRef = useRef(null); 


useEffect(() => {
  dispatch(fetchTasks());
  dispatch(fetchMembers());
  dispatch(fetchProjects());
}, [dispatch]);

const handleFilter = (value)=>{
    dispatch(fetchTasks({status:value}))
  }

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
        if (!formData.title || formData.title.trim() === '') {
          errors.title = 'Enter task title';
          isError = true;
        }
        else {
          errors.title = '';
        }
      }

      if (field === 'all' || field === 'description') {
        if (!formData.projectId || formData.projectId.trim() === '') {
          errors.projectId = 'Select project for createing the task';
          isError = true;
        }else {
          errors.projectId = '';
        }
      }

       if (field === 'all' || field === 'description') {
        if (!formData.assignedTo || formData.assignedTo.trim() === '') {
          errors.assignedTo = 'Select employe for assigning the task';
          isError = true;
        }else {
          errors.assignedTo = '';
        }
      }

      setFormError(errors);
      return isError; // true means there's an error
  }

  const handleSaveTask = async () => {
      const isValidate = handleValidation();
      if (!isValidate) {
          if (formEditMode) {
              await dispatch(updateTask(formData));
          } else {
              await dispatch(createTask(formData));
          }
          closeModal();
          dispatch(fetchTasks());
      }
  };

  const handleToggleStatus = async (id,status)=>{
      await dispatch(toggleTaskstatus({id,field:"isActive",value:status}));
  }

  const handleUpdateProgress = async (id,status)=>{
      await dispatch(updateTaskProgress({id,status}));
  }

  const closeModal = () => {
      closeButtonRef.current?.click();
      resetForm();
  };

  const resetForm = async ()=>{
      await setFormData({});
      await setFormError({title: '', description: '',projectId:'',priority:'',assignedTo:'' });
  }

  const openCreateModal = () => {
    // setFormData({ name: '', description: '' });
    
    resetForm();
    // console.log(formData)
    setFormEditMode(false);
   
  };

  const openEditModal = (task) => {
    // console.log("project:- ",project);
    resetForm();
    // console.log(formData)
    setFormData({ _id:task._id,title: task.title, description: task.description,projectId:task.projectId._id,priority:task.priority,assignedTo:task.assignedTo._id});
    setFormEditMode(true);
  };

  const handleDeleteProject = (id) => {
    Swal.fire({
      title: 'Are you sure?',text: "You won't be able to revert this!",icon: 'warning',showCancelButton: true,confirmButtonColor: '#d33',cancelButtonColor: '#3085d6',confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
          await dispatch(deleteTask(id));
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
    accessorKey: 'title',
    header: 'Task Title',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    Cell: ({ cell }) => {
      const priority = cell.getValue();
      const colorClass = priority === 'High' ? 'text-danger'
                        : priority === 'Medium' ? 'text-warning'
                        : 'text-success';
      return <span className={colorClass} style={{ fontWeight: '600' }}>{priority}</span>;
    },
  },
  {
    header: 'Project',
    Cell: ({ row }) => (
      <>
        {row.original.projectId.name}<br />
        <span style={{ fontSize: '12px' }}>{row.original.projectId.description}</span>
      </>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    Cell: ({ cell, row }) => {
      const status = cell.getValue();
      return (
        <div className="d-flex align-items-center gap-2">
          <span className={`badge text-white ${status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
            {status}
          </span>
          {user.role === 'employee' && (
             <>
                <span style={{ color: 'lightgrey' }}>|</span>
                <input
                  type="checkbox"
                  checked={(status === "Completed")}
                  style={{transform:"scale(1.8)",marginLeft:"8px",cursor:"pointer",accentColor:'#198754 '}}
                  onChange={() => handleUpdateProgress(row.original._id,(status === "Completed")?"In-Progress" :"Completed")}
                />
             </>
          )}
        </div>
      );
    }
  },
  ...(user.role !== 'employee' ? [
    {
      header: 'Assign Employee',
      Cell: ({ row }) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
          {row.original.assignedTo
            ? <span className="badge bg-light text-dark" style={{ border: '1px solid grey' }}>
                {row.original.assignedTo.firstname} | {row.original.assignedTo.role.toUpperCase()}
              </span>
            : <span className="text-muted">No Members</span>
          }
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
      Cell: ({ cell }) => <>{cell.getValue().firstname} {cell.getValue().lastname}</>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
    },
    {
      accessorKey: 'Actions',
      header: 'Actions',
      Cell: ({ row }) => {
        const { _id, isActive } = row.original;
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={isActive}
                onChange={() => handleToggleStatus(_id, !isActive)}
                style={{ transform: 'scale(1.1)', marginRight: '10px', cursor: 'pointer' }}
              />
            </div>
            <span style={{ color: 'lightgrey' }}>|</span>
            <span className="text-primary cursor-pointer" style={{ fontWeight: '500' }} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => openEditModal(row.original)}>
              Edit
            </span>
            <span className="text-danger" style={{ fontWeight: '500', cursor: 'pointer' }} onClick={() => handleDeleteProject(row.original._id)}>
              Delete
            </span>
          </div>
        );
      },
    }
  ] : [])
], [user]);

  const table = useMaterialReactTable({
    columns,
    data: tasks,
    state: { isLoading: task_loading },
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
        <h2 className='mx-3'>Tasks</h2>
        <div className="mx-3 d-flex align-items-center mt-5 justify-content-end mb-5" style={{ columnGap: "10px" }}>
          <div className='d-flex align-items-center'>
           <div style={{display: "flex",marginRight: "5px",alignItems: "center"}}>
             <i class="fas fa-filter" style={{fontSize: "14px"}}></i>
             <h5 style={{fontWeight: 500,marginLeft: "4px",fontSize: "15px",marginBottom: "0px"}}>Filter</h5>
           </div>
            <select
              className="form-select form-select w-auto"
              aria-label=".form-select-lg example"
              //value={viewFilter}
              onChange={(e)=>handleFilter(e.target.value)} // Attach onChange handler
            >
              <option value="all">All</option>
              <option value="In-Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          {
             (user.role === "admin" || user.role === "manager")
             ?
              <>
                 <span style={{color:"lightgrey"}}>|</span>
                 <div className="dropdown">
                  <button className="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{ backgroundColor: "#22218b",width: "130px",padding: "0px", height: "40px" }} onClick={openCreateModal}>
                    Add Task
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
              </>
            :
            ""
          }
         
        </div>
        {
           (task_loading)
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
                  <h5 className="modal-title">{ formEditMode ? 'Edit Task' : 'Create Task'}</h5>
                </div>

                <div className="modal-body" style={{ minHeight: "300px", padding: "2rem" }} key={formEditMode ? 'create' : 'edit'}>
                  <div className="mb-3">
                    <label className='field-lab'>Task title</label>
                    <input
                      type="text"
                      className={`form-control field-val ${formError.title ? 'form-input-error' : ''}`}
                      placeholder="Enter title"
                      value={formData?.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    {formError.title && <span className="form-label-error d-block mt-1">{formError.title}</span>}
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className='field-lab'>Description</label>
                    <textarea
                      className={`form-control`}
                      rows="3"
                      placeholder="Enter description"
                      value={formData?.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                    {/* {formError.description && <span className="form-label-error d-block mt-1">{formError.description}</span>} */}
                  </div>

                  <div className="mb-3">
                    <label className='field-lab'>Project</label>
                    <select
                        className={`form-select ${formError.projectId ? 'form-input-error' : ''}`}
                        value={formData?.projectId || ''}
                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                        >
                        <option value="">-Select Project-</option>
                        {projects?.map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.name}
                          </option>
                        ))}
                    </select>
                    {formError.projectId && <span className="form-label-error d-block mt-1">{formError.projectId}</span>}
                  </div>

                  <div className="mb-3">
                    <label className='field-lab'>Priority</label>
                      <select
                        className={`form-select`}
                        value={formData?.priority || ''}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                        <option value="">-Select Priority-</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      {/* {formError.description && <span className="form-label-error d-block mt-1">{formError.description}</span>} */}
                  </div>

                  {/* Assign Members */}
                 <div className="mb-3">
                    <label className='field-lab'>Assign To Employe</label>
                      <select
                        className={`form-select ${formError.projectId ? 'form-input-error' : ''}`}
                        value={formData?.assignedTo || ''}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        >
                        <option value="">-Select Project-</option>
                        {members?.map((member) => (
                          <option key={member._id} value={member._id}>
                            {member.firstname} {member.lastname}
                          </option>
                        ))}
                      </select>
                      {formError.assignedTo && <span className="form-label-error d-block mt-1">{formError.assignedTo}</span>}
                  </div>
                </div>

               <div className="modal-footer d-flex">
                  <button type="button" className="btn btn-secondary" id="close-btn-modal" data-bs-dismiss="modal" style={{color:"#6c757d",backgroundColor:"transparent"}} ref={closeButtonRef}>Close</button>
                  <button type="button" className="btn btn-primary" id="save-btn-modal" style={{backgroundColor:"#22218b",width:"80px",padding: "0px",height: "37px"}} onClick={()=>handleSaveTask()}>
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

export default Task;
