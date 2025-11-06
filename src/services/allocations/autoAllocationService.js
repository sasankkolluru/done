// src/services/allocations/autoAllocationService.js
import { differenceInMinutes, isWithinInterval } from 'date-fns';

class AutoAllocationService {
  constructor() {
    this.allocations = [];
    this.facultyWorkload = new Map();
  }

  initialize(faculty, exams, existingAllocations = []) {
    this.allocations = [...existingAllocations];
    this.initializeFacultyWorkload(faculty);
    this.processExistingAllocations();
  }

  initializeFacultyWorkload(faculty) {
    this.facultyWorkload = new Map(
      faculty.map(f => [f.id, { ...f, allocatedHours: 0, scheduledSlots: [] }])
    );
  }

  processExistingAllocations() {
    this.allocations.forEach(allocation => {
      const faculty = this.facultyWorkload.get(allocation.facultyId);
      if (faculty && allocation.exam) {
        const duration = this.calculateDuration(allocation.exam);
        faculty.allocatedHours += duration;
        faculty.scheduledSlots.push({
          examId: allocation.examId,
          startTime: allocation.exam.startTime,
          endTime: allocation.exam.endTime
        });
      }
    });
  }

  calculateDuration(exam) {
    return differenceInMinutes(
      new Date(exam.endTime),
      new Date(exam.startTime)
    ) / 60;
  }

  isFacultyAvailable(facultyId, startTime, endTime) {
    const faculty = this.facultyWorkload.get(facultyId);
    if (!faculty) return false;

    return !faculty.scheduledSlots.some(slot => 
      isWithinInterval(new Date(startTime), {
        start: new Date(slot.startTime),
        end: new Date(slot.endTime)
      }) ||
      isWithinInterval(new Date(endTime), {
        start: new Date(slot.startTime),
        end: new Date(slot.endTime)
      })
    );
  }

  findAvailableFaculty(startTime, endTime, requiredCount) {
    return Array.from(this.facultyWorkload.values())
      .filter(faculty => 
        this.isFacultyAvailable(faculty.id, startTime, endTime)
      )
      .sort((a, b) => a.allocatedHours - b.allocatedHours)
      .slice(0, requiredCount);
  }

  async generateAllocations(faculty, exams) {
    this.initialize(faculty, exams, this.allocations);
    const newAllocations = [];

    // Sort exams by date and priority
    const sortedExams = [...exams].sort((a, b) => 
      new Date(a.startTime) - new Date(b.startTime)
    );

    for (const exam of sortedExams) {
      const requiredInvigilators = Math.ceil(exam.rooms?.length * 1.5) || 1;
      const availableFaculty = this.findAvailableFaculty(
        exam.startTime,
        exam.endTime,
        requiredInvigilators
      );

      exam.rooms?.forEach((room, index) => {
        const facultyIndex = index % availableFaculty.length;
        const facultyMember = availableFaculty[facultyIndex];
        
        if (facultyMember) {
          const allocation = {
            id: `alloc-${exam.id}-${room}-${Date.now()}`,
            examId: exam.id,
            facultyId: facultyMember.id,
            roomId: room,
            status: 'assigned',
            createdAt: new Date().toISOString()
          };

          newAllocations.push(allocation);
          
          // Update faculty workload
          const duration = this.calculateDuration(exam);
          facultyMember.allocatedHours += duration;
          facultyMember.scheduledSlots.push({
            examId: exam.id,
            startTime: exam.startTime,
            endTime: exam.endTime,
            roomId: room
          });
        }
      });
    }

    this.allocations = [...this.allocations, ...newAllocations];
    return this.allocations;
  }
}

export const autoAllocationService = new AutoAllocationService();