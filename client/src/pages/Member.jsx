import { useMemo, useState, useEffect,useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Navbar from '../components/layout/Navbar';
import { useDispatch,useSelector } from 'react-redux';
import { clearMessages } from '../features/member/memberSlice';
import { fetchMembers,assignRole } from '../features/member/memberThunks';
import loader from '../assets/loader.gif';

const Member = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state)=>state.auth);
  const {members,loading_member,successMessage,errorMessage} = useSelector((state)=>state.members)
  const [formData,setFormData] = useState({});
  const closeButtonRef = useRef(null);
  // const {filter,setFilter} = useState({}); 

  useEffect(()=>{
    dispatch(fetchMembers());
  },[dispatch]);

  const handleFilter = (value)=>{
    dispatch(fetchMembers({role:value}))
  }
  
  useEffect(() => {
    if (successMessage) {
        toast.success(successMessage);
        dispatch(clearMessages());
    }
    if (errorMessage) {
        toast.error(errorMessage);
        dispatch(clearMessages());
    }
  }, [successMessage, errorMessage]);

  const handleSaveRole = async () => {
          console.log(formData);
          await dispatch(assignRole(formData));
          closeModal();
  };

  const closeModal = () => {
      closeButtonRef.current?.click();
      resetForm();
  };

  const resetForm = async ()=>{
      await setFormData({});
  }

  const openEditModal = (memberData) => {
    resetForm();
    setFormData({user_id:memberData._id,role:memberData.role})
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: '_id',
        header: '#Sr No',
        size: 80,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'firstname',
        header: 'First Name',
      },
      {
        accessorKey: 'lastname',
        header: 'Last Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
        Cell: ({ cell }) => (
         <span style={{fontWeight:'500',letterSpacing:'0.5px'}} className={` ${cell.getValue() === 'manager' ? 'text-warning' : 'text-dark'}`}>
            {cell.getValue().toUpperCase()}
         </span>
        ),
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
    ];

    if (user?.role === 'admin') {
      baseColumns.push({
        accessorKey: 'Actions',
        header: 'Actions',
        Cell: ({ row }) => {
          return (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
                className="text-primary cursor-pointer"
                style={{ fontWeight: '500', cursor: 'pointer' }}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => openEditModal(row.original)}
              >
                Assign Role
              </span>
            </div>
          );
        },
      });
    }

    return baseColumns;
  }, [user]);

  const table = useMaterialReactTable({
    columns,
    data: members,
    state: { isLoading: loading_member },
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
        <h2 className={`mx-3 ${user.role === 'manager' ? 'mb-5' : ''}`}>Members</h2>
        {
          (user.role === "admin")
            ?
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
              <option value="manager">Manager</option>
              <option value="employee">Employe</option>
            </select>
          </div>
            </div>
            :
            <></> 
        }
        
        {
           (loading_member)
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
                  <h5 className="modal-title">Assign Role</h5>
                </div>

                <div className="modal-body">
                  {/* Assign Role */}
                  <div className="mb-3">
                    <label className='field-lab'>Role</label>
                      <select
                        className={`form-select`}
                        value={formData?.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                        <option value="">-Select Role-</option>
                        <option value="manager">Manager</option>
                        <option value="employee">Employe</option>
                      </select>
                      {/* {formError.description && <span className="form-label-error d-block mt-1">{formError.description}</span>} */}
                  </div>
                </div>

               <div className="modal-footer d-flex" style={{marginTop:'0px',paddingLeft:'15px'}}>
                  <button type="button" className="btn btn-secondary" id="close-btn-modal" data-bs-dismiss="modal" style={{color:"#6c757d",backgroundColor:"transparent"}} ref={closeButtonRef}>Close</button>
                  <button type="button" className="btn btn-primary" id="save-btn-modal" style={{backgroundColor:"#22218b",width:"80px",padding: "0px",height: "37px"}} onClick={()=>handleSaveRole()}>
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

export default Member;
