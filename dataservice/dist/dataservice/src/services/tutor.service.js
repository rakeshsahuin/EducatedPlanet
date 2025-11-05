"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorService = exports.TutorService = void 0;
const mongoose_1 = require("mongoose");
const datamodels_1 = require("../datamodels");
/**
 * Tutor service for handling tutor-related business logic
 */
class TutorService {
    /**
     * Transform MongoDB document to Tutor interface
     */
    transformTutorDocument(tutorDoc) {
        return {
            id: tutorDoc._id.toString(),
            name: tutorDoc.name,
            title: tutorDoc.title,
            photo: tutorDoc.photo,
            subjects: tutorDoc.subjects,
            teachingModes: tutorDoc.teachingModes,
            location: tutorDoc.location,
            experience: tutorDoc.experience,
            price: tutorDoc.price,
            rating: tutorDoc.rating || { average: 0, count: 0 },
            isVerified: tutorDoc.verification?.isApproved || false,
            createdAt: tutorDoc.createdAt,
            updatedAt: tutorDoc.updatedAt
        };
    }
    /**
     * Create a new tutor profile
     */
    async createTutor(tutorData) {
        // Validate input
        this.validateTutorData(tutorData);
        // Check if user already has a tutor profile
        if (tutorData.userId) {
            const existingTutor = await datamodels_1.TutorQueries.findByUserId(tutorData.userId);
            if (existingTutor) {
                throw new Error('User already has a tutor profile');
            }
        }
        // Create tutor profile
        const tutorDoc = await datamodels_1.TutorQueries.create({
            ...tutorData,
            userId: tutorData.userId ? new mongoose_1.Types.ObjectId(tutorData.userId) : undefined,
            status: 'pending', // New profiles need approval
            isActive: true,
            verification: {
                isApproved: false
            },
            analytics: {
                profileViews: 0,
                contactViews: 0,
                connects: 0
            }
        });
        return this.transformTutorDocument(tutorDoc);
    }
    /**
     * Find tutor by ID
     */
    async findTutorById(id) {
        const tutorDoc = await datamodels_1.TutorQueries.findById(id);
        return tutorDoc ? this.transformTutorDocument(tutorDoc) : null;
    }
    /**
     * Search tutors with filters
     */
    async searchTutors(params) {
        const { page = 1, limit = 20 } = params;
        const searchResult = await datamodels_1.TutorQueries.search({
            ...params,
            page,
            limit
        });
        const tutors = searchResult.map(doc => this.transformTutorDocument(doc));
        return {
            tutors,
            total: searchResult.length, // This would need adjustment for actual pagination
            page,
            totalPages: Math.ceil(searchResult.length / limit)
        };
    }
    /**
     * Get approved tutors
     */
    async getApprovedTutors(page = 1, limit = 20) {
        const tutorDocs = await datamodels_1.TutorQueries.findApproved();
        return tutorDocs.map(doc => this.transformTutorDocument(doc));
    }
    /**
     * Get featured tutors
     */
    async getFeaturedTutors(limit = 10) {
        const tutorDocs = await datamodels_1.TutorQueries.findFeatured();
        return tutorDocs.map(doc => this.transformTutorDocument(doc));
    }
    /**
     * Find tutors by subject
     */
    async findTutorsBySubject(subject, limit = 20) {
        const tutorDocs = await datamodels_1.TutorQueries.findBySubjects([subject]);
        return tutorDocs.map(doc => this.transformTutorDocument(doc));
    }
    /**
     * Find tutors by location
     */
    async findTutorsByLocation(city, areas) {
        // For now, implement a simple location search by areas
        // In a real implementation, this would use geo coordinates
        const tutorDocs = areas && areas.length > 0
            ? await datamodels_1.TutorQueries.findByAreas(areas)
            : await datamodels_1.TutorQueries.findApproved();
        return tutorDocs.map((doc) => this.transformTutorDocument(doc));
    }
    /**
     * Find tutors by areas
     */
    async findTutorsByAreas(areas) {
        const tutorDocs = await datamodels_1.TutorQueries.findByAreas(areas);
        return tutorDocs.map(doc => this.transformTutorDocument(doc));
    }
    /**
     * Get top-rated tutors
     */
    async getTopRatedTutors(limit = 10) {
        const tutorDocs = await datamodels_1.TutorQueries.getTopRated(limit);
        return tutorDocs.map(doc => this.transformTutorDocument(doc));
    }
    /**
     * Get recently added tutors
     */
    async getRecentTutors(limit = 10) {
        const tutorDocs = await datamodels_1.TutorQueries.getRecent(limit);
        return tutorDocs.map(doc => this.transformTutorDocument(doc));
    }
    /**
     * Update tutor by ID
     */
    async updateTutor(id, updateData) {
        // Validate update data
        if (updateData.price) {
            if (updateData.price.min && updateData.price.min < 0) {
                throw new Error('Minimum price cannot be negative');
            }
            if (updateData.price.max && updateData.price.max < 0) {
                throw new Error('Maximum price cannot be negative');
            }
            if (updateData.price.min && updateData.price.max && updateData.price.min > updateData.price.max) {
                throw new Error('Minimum price cannot be greater than maximum price');
            }
        }
        // Transform UpdateTutorInput to ITutorDocument format
        const transformedUpdateData = { ...updateData };
        const updatedDoc = await datamodels_1.TutorQueries.updateById(id, transformedUpdateData);
        return updatedDoc ? this.transformTutorDocument(updatedDoc) : null;
    }
    /**
     * Approve tutor (admin function)
     */
    async approveTutor(id, approvedBy) {
        const updatedDoc = await datamodels_1.TutorQueries.approveTutor(id, approvedBy);
        return updatedDoc ? this.transformTutorDocument(updatedDoc) : null;
    }
    /**
     * Reject tutor (admin function)
     */
    async rejectTutor(id, rejectionReason) {
        const updatedDoc = await datamodels_1.TutorQueries.rejectTutor(id, rejectionReason);
        return updatedDoc ? this.transformTutorDocument(updatedDoc) : null;
    }
    /**
     * Get pending tutor applications (admin function)
     */
    async getPendingApplications(page = 1, limit = 20) {
        // Find tutors with pending status using direct model query
        const tutorDocs = await datamodels_1.TutorModel.find({
            status: 'pending',
            isActive: true
        }).populate('userId');
        return tutorDocs.map((doc) => this.transformTutorDocument(doc));
    }
    /**
     * Increment profile views
     */
    async incrementProfileViews(id) {
        return await datamodels_1.TutorQueries.incrementProfileViews(id);
    }
    /**
     * Increment contact views
     */
    async incrementContactViews(id) {
        return await datamodels_1.TutorQueries.incrementContactViews(id);
    }
    /**
     * Increment connects (when a user contacts a tutor)
     */
    async incrementConnects(id) {
        return await datamodels_1.TutorQueries.incrementConnects(id);
    }
    /**
     * Update tutor rating (typically called after review updates)
     */
    async updateTutorRating(id) {
        return await datamodels_1.TutorQueries.updateRating(id);
    }
    /**
     * Delete tutor profile (soft delete)
     */
    async deleteTutor(id) {
        return await datamodels_1.TutorQueries.softDelete(id);
    }
    /**
     * Get tutor statistics (admin function)
     */
    async getTutorStats() {
        return await datamodels_1.TutorQueries.getCountByStatus();
    }
    /**
     * Validate tutor data
     */
    validateTutorData(tutorData) {
        if (!tutorData.name || tutorData.name.trim().length === 0) {
            throw new Error('Name is required');
        }
        if (tutorData.name.length > 100) {
            throw new Error('Name cannot exceed 100 characters');
        }
        if (!tutorData.title || tutorData.title.trim().length === 0) {
            throw new Error('Title is required');
        }
        if (tutorData.title.length > 200) {
            throw new Error('Title cannot exceed 200 characters');
        }
        if (!tutorData.photo || tutorData.photo.trim().length === 0) {
            throw new Error('Photo is required');
        }
        if (!tutorData.subjects || tutorData.subjects.length === 0) {
            throw new Error('At least one subject is required');
        }
        if (!tutorData.teachingModes || tutorData.teachingModes.length === 0) {
            throw new Error('At least one teaching mode is required');
        }
        if (!tutorData.experience || tutorData.experience.trim().length === 0) {
            throw new Error('Experience is required');
        }
        if (!tutorData.location) {
            throw new Error('Location is required');
        }
        if (!tutorData.location.city || tutorData.location.city.trim().length === 0) {
            throw new Error('City is required');
        }
        if (!tutorData.price) {
            throw new Error('Price information is required');
        }
        if (tutorData.price.min < 0 || tutorData.price.max < 0) {
            throw new Error('Price cannot be negative');
        }
        if (tutorData.price.min > tutorData.price.max) {
            throw new Error('Minimum price cannot be greater than maximum price');
        }
    }
}
exports.TutorService = TutorService;
// Export singleton instance
exports.tutorService = new TutorService();
//# sourceMappingURL=tutor.service.js.map