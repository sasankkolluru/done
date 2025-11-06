import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Upload, FileSpreadsheet, Check, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
<<<<<<< HEAD
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
=======
import { toast } from 'sonner';
import adminAPI from '@/services/adminAPI';
>>>>>>> 7dbaff3 (Resolve merge conflicts)

const DataUpload = () => {
  const [facultyFile, setFacultyFile] = useState<File | null>(null);
  const [examFile, setExamFile] = useState<File | null>(null);
  const [classroomFile, setClassroomFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (file: File, type: string) => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setPreviewData(results.data.slice(0, 10));
        toast.success(`File parsed successfully! ${results.data.length} rows found.`);
      },
      error: (error) => {
        toast.error(`Error parsing file: ${error.message}`);
      },
    });

    if (type === 'faculty') setFacultyFile(file);
    if (type === 'exam') setExamFile(file);
    if (type === 'classroom') setClassroomFile(file);
  };

<<<<<<< HEAD
  const handleUploadToDatabase = async (type: string) => {
    const file = type === 'faculty' ? facultyFile : type === 'exam' ? examFile : classroomFile;
    if (!file) {
      toast.error('Please select a file first');
=======
  const handleUpload = async (type: string) => {
    if (uploading) return;

    let file: File | null = null;
    let endpoint = '';

    switch (type) {
      case 'faculty':
        file = facultyFile;
        endpoint = 'faculty';
        break;
      case 'exam':
        file = examFile;
        endpoint = 'exams';
        break;
      case 'classroom':
        file = classroomFile;
        endpoint = 'classrooms';
        break;
      default:
        return;
    }

    if (!file) {
      toast.error(`Please select a ${type} file first`);
>>>>>>> 7dbaff3 (Resolve merge conflicts)
      return;
    }

    setUploading(true);
    setProgress(0);

<<<<<<< HEAD
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data;
        const totalRows = data.length;
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < totalRows; i++) {
          try {
            const row = data[i] as any;

            if (type === 'faculty') {
              await supabase.from('faculty').insert({
                employee_id: row.employee_id || row.id,
                department: row.department,
                specialization: row.specialization,
                max_duties_per_month: parseInt(row.max_duties) || 10,
              });
            } else if (type === 'exam') {
              await supabase.from('exams').insert({
                exam_name: row.exam_name || row.name,
                exam_date: row.exam_date || row.date,
                start_time: row.start_time,
                end_time: row.end_time,
                subject: row.subject,
                department: row.department,
                course: row.course,
                semester: row.semester,
                total_students: parseInt(row.total_students) || 0,
              });
            } else if (type === 'classroom') {
              await supabase.from('classrooms').insert({
                room_number: row.room_number || row.room,
                building: row.building,
                capacity: parseInt(row.capacity) || 30,
                facilities: row.facilities ? row.facilities.split(',') : [],
                is_available: row.is_available !== 'false',
              });
            }

            successCount++;
          } catch (error) {
            console.error(`Error inserting row ${i}:`, error);
            errorCount++;
          }

          setProgress(Math.round(((i + 1) / totalRows) * 100));
        }

        toast.success(
          `Upload complete! ${successCount} rows inserted successfully${errorCount > 0 ? `, ${errorCount} errors` : ''}.`
        );
        setUploading(false);
        setProgress(0);
      },
      error: (error) => {
        toast.error(`Error: ${error.message}`);
        setUploading(false);
        setProgress(0);
      },
    });
=======
    try {
      // Read the file content
      const fileContent = await file.text();
      
      // Parse the CSV data
      const { data, errors } = await new Promise((resolve) => {
        Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results),
          error: (error) => resolve({ data: [], errors: [error] })
        });
      });

      if (errors && errors.length > 0) {
        throw new Error('Failed to parse CSV file');
      }

      // Upload the data using the adminAPI
      const response = await adminAPI.uploadData(endpoint, { data });

      if (response.success) {
        toast.success(`Successfully uploaded ${data.length} ${type} records`);
        
        // Reset the file input
        switch (type) {
          case 'faculty':
            setFacultyFile(null);
            break;
          case 'exam':
            setExamFile(null);
            break;
          case 'classroom':
            setClassroomFile(null);
            break;
        }
        
        setPreviewData([]);
      } else {
        throw new Error(response.message || 'Failed to upload data');
      }
    } catch (error: any) {
      console.error(`Error uploading ${type} data:`, error);
      toast.error(`Failed to upload ${type} data: ${error.message}`);
    } finally {
      setUploading(false);
      setProgress(0);
    }
>>>>>>> 7dbaff3 (Resolve merge conflicts)
  };

  const FileUploadCard = ({
    title,
    description,
    type,
    file,
    sampleFormat,
  }: {
    title: string;
    description: string;
    type: string;
    file: File | null;
    sampleFormat: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`${type}-upload`}>Upload CSV File</Label>
          <Input
            id={`${type}-upload`}
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, type);
            }}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Sample format: {sampleFormat}
          </p>
        </div>

        {file && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (type === 'faculty') setFacultyFile(null);
                if (type === 'exam') setExamFile(null);
                if (type === 'classroom') setClassroomFile(null);
                setPreviewData([]);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">
              Uploading... {progress}%
            </p>
          </div>
        )}

        <Button
          onClick={() => handleUploadToDatabase(type)}
          disabled={!file || uploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload to Database
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <SEO title="Data Upload - Admin Dashboard" />

      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Data Upload</h1>
          <p className="text-muted-foreground text-lg">
            Upload CSV files to populate the database
          </p>
        </div>

        <Tabs defaultValue="faculty" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faculty">Faculty Data</TabsTrigger>
            <TabsTrigger value="exams">Exam Data</TabsTrigger>
            <TabsTrigger value="classrooms">Classroom Data</TabsTrigger>
          </TabsList>

          <TabsContent value="faculty" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FileUploadCard
                title="Upload Faculty Data"
                description="Import faculty members with their details"
                type="faculty"
                file={facultyFile}
                sampleFormat="employee_id, department, specialization, max_duties"
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="exams" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FileUploadCard
                title="Upload Exam Data"
                description="Import exam schedule and details"
                type="exam"
                file={examFile}
                sampleFormat="exam_name, exam_date, start_time, end_time, subject, department"
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="classrooms" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FileUploadCard
                title="Upload Classroom Data"
                description="Import classroom and venue information"
                type="classroom"
                file={classroomFile}
                sampleFormat="room_number, building, capacity, facilities"
              />
            </motion.div>
          </TabsContent>
        </Tabs>

        {previewData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Data Preview
                </CardTitle>
                <CardDescription>
                  Showing first 10 rows of uploaded data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(previewData[0] || {}).map((key) => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, index) => (
                        <TableRow key={index}>
                          {Object.values(row).map((value: any, i) => (
                            <TableCell key={i}>{value}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DataUpload;
