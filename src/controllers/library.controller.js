const libraryRepository = require('../repository/library.repository');
const r = require('../utils/utils');


exports.getAllLibraries = async (req, res) => {
    try {
        const users = await libraryRepository.getAllLibraries();
        r.resp(res, true, 200, "Libraries retrieved successfully", users);
    } catch (error) {
        r.resp(res, false, 500, "Error retrieving users", error);
    }
}

exports.getLibraryByUser = async(req, res) => {
    if(!req.params.id) {
        return r.resp(res, false, 400, "User ID is required", null);
    }
    
    try {
        const user = await libraryRepository.getLibraryByUser(req.params.id);
        if(user) {
            r.resp(res, true, 201, "Library retrieved successfully", user);
        } else {
            r.resp(res, false, 404, "Library not found", null)
        }
    } catch (error) {
        r.resp(res, false, 500, "Error retrieving users", error);
    }
}

exports.deleteLibraryByUser = async(req, res) => {
    if(!req.params.id) {
        return r.resp(res, false, 400, "Library ID is required", null);
    }
    
    try {
        if(!req.params.user_id) {
            return r.resp(res, false, 400, "User ID is required", null);
        }
        
        const user = await libraryRepository.deleteLibrary(req.params.user_id);
        if(user) {
            r.resp(res, true, 201, "User Library deleted successfully", user);
        } else {
            r.resp(res, false, 404, "Library not found", null)
        }
    } catch (error) {
        r.resp(res, false, 500, "Error deleting users", error);
    }
}