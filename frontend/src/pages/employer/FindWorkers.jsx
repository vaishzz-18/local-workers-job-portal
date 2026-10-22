import { apiUrl } from "../../config/api";
import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  CheckCircle,
  Star,
  Briefcase,
  ChevronDown,
  UserCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams, useNavigate } from "react-router-dom";

const FindWorkers = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialLocation = searchParams.get("location") || "All Locations";

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState(initialLocation);
  const [skillFilter, setSkillFilter] = useState("All Skills");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const res = await axios.get(
        apiUrl("/api/employer/workers"),
        config,
      );
      if (res.data.success) {
        setWorkers(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch workers");
    } finally {
      setLoading(false);
    }
  };

  // Extract unique skills for dropdown
  const allSkills = Array.from(new Set(workers.flatMap(w => w.skills)));
  
  // Extract unique locations for dropdown
  const allLocations = Array.from(new Set(workers.map(w => w.city || w.userId?.location).filter(Boolean)));

  // Filter workers
  const filteredWorkers = workers.filter((worker) => {
    const name = worker.userId?.name || "";
    const loc = worker.city || worker.userId?.location || "";
    
    // Search by name
    if (search && !name.toLowerCase().includes(search.toLowerCase())) return false;
    
    // Filter by location dropdown
    if (locationFilter !== "All Locations" && loc !== locationFilter) return false;
    
    // Filter by skill dropdown
    if (skillFilter !== "All Skills" && !worker.skills.includes(skillFilter)) return false;
    
    // Filter by availability
    if (availabilityFilter !== "All" && worker.availability !== availabilityFilter) return false;
    
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] dark:bg-slate-900 pb-12">
      {/* Top Header */}
      <div className="bg-[#FDFBF7] dark:bg-slate-900 pt-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
            Find Workers
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search workers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
              />
            </div>
            
            <div className="relative w-full md:w-48">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
              >
                <option value="All Locations">All Locations</option>
                {allLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
            
            <div className="relative w-full md:w-48">
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
              >
                <option value="All Skills">All Skills</option>
                {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative w-full md:w-48">
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
              >
                <option value="All">All</option>
                <option value="Available">Available</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Not Available">Not Available</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
          {filteredWorkers.length} workers found
        </p>

        {loading ? (
          <div className="text-center py-10 text-slate-500 font-bold">Loading workers...</div>
        ) : filteredWorkers.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-bold">No workers found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker, index) => {
              const name = worker.userId?.name || "Unknown Worker";
              const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
              
              // Stats that will be dynamically calculated in a future phase once jobs are completed
              const rating = worker.rating ? worker.rating.toFixed(1) : "New";
              const jobsCompleted = worker.jobsCompleted || 0;

              return (
                <motion.div
                  key={worker._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-800 overflow-hidden shrink-0">
                          {worker.userId?.profileImage ? (
                            <img src={worker.userId.profileImage} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            initials
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{name}</h3>
                            {worker.verificationStatus === 'Approved' && (
                              <CheckCircle className="w-4 h-4 text-green-500 fill-green-100 dark:fill-green-900/30" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {worker.city || worker.userId?.location || "Unknown"}
                          </div>
                        </div>
                      </div>
                      
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        worker.availability === "Available" ? "bg-green-50 text-green-700 border border-green-200" :
                        worker.availability === "Part-Time" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                        "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {worker.availability}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 line-clamp-2 min-h-[40px]">
                      {worker.bio || "Hardworking professional ready for new opportunities and tasks."}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6 min-h-[28px]">
                      {worker.skills?.slice(0, 3).map(skill => (
                        <span key={skill} className="px-3 py-1 bg-[#F16622] text-white text-xs font-semibold rounded-full">
                          {skill}
                        </span>
                      ))}
                      {worker.skills?.length > 3 && (
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-full">
                          +{worker.skills.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-1 font-semibold">
                        <Star className={`w-4 h-4 ${rating === "New" ? "text-slate-300 fill-slate-300 dark:text-slate-600 dark:fill-slate-600" : "text-amber-400 fill-amber-400"}`} />
                        {rating === "New" ? <span className="text-slate-400 font-medium">No ratings</span> : rating}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        {jobsCompleted} jobs
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        ₹{worker.pricing || 350}/{worker.pricingType === 'Daily' ? 'day' : 'hr'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex gap-3">
                    <button 
                      onClick={() => setSelectedProfile(worker)}
                      className="flex-1 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors text-sm"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => navigate('/chat', { state: { initialUser: worker.userId } })}
                      className="flex-1 py-2 bg-[#F16622] text-white font-semibold rounded-lg hover:bg-[#d65a1e] transition-colors text-sm"
                    >
                      Contact
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile Viewer Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-700"
            >
              <div className="sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center z-10">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCircle className="w-6 h-6 text-indigo-500" />
                  Worker Profile
                </h3>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Basic Info */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-2xl rounded-2xl shadow-inner border border-white overflow-hidden shrink-0">
                    {selectedProfile.userId?.profileImage ? (
                      <img src={selectedProfile.userId.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      selectedProfile.userId?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    )}
                  </div>
                  <div>
                    <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">{selectedProfile.userId?.name}</h4>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                        selectedProfile.verificationStatus === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {selectedProfile.verificationStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                      <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Availability</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{selectedProfile.availability}</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                      <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">City</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{selectedProfile.city || selectedProfile.userId?.location || "Not specified"}</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                      <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Experience</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{selectedProfile.experience} Years</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                      <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Pricing</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">₹{selectedProfile.pricing} / {selectedProfile.pricingType}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.skills && selectedProfile.skills.length > 0 ? (
                        selectedProfile.skills.map((s, i) => (
                          <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400 text-sm">No skills added</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Bio</span>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                      {selectedProfile.bio || "No bio provided."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FindWorkers;
