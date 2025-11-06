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
import { Upload, FileSpreadsheet, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { toast } from 'sonner';
import adminAPI from '@/services/adminAPI';

type UploadType = 'faculty' | 'exam' | 'classroom';

interface UploadState {
  file: File | null;
  data: any[];
  headers: string[];
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

export default function DataUpload() {
  const [activeTab, setActiveTab] = useState<UploadType>('faculty');
  const [uploadStates, setUploadStates] = useState<Record<UploadType, UploadState>>({
    faculty: { file: null, data: [], headers: [], isUploading: false, progress: 0, error: null, success: false },
    exam: { file: null, data: [], headers: [], isUploading: false, progress: 0, error: null, success: false },
    classroom: { file: null, data: [], headers: [], isUploading: false, progress: 0, error: null, success: false },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: UploadType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state for this upload type
    setUploadStates(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        file,
        data: [],
        headers: [],
        error: null,
        success: false,
      },
    }));

    // Parse the CSV file
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setUploadStates(prev => ({
            ...prev,
            [type]: {
              ...prev[type],
              error: 'Error parsing CSV file',
            },
          }));
          return;
        }

        setUploadStates(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            data: results.data,
            headers: results.meta.fields || [],
          },
        }));
      },
      error: (error) => {
        setUploadStates(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            error: `Error parsing file: ${error.message}`,
          },
        }));
      },
    });
  };

  const handleUpload = async (type: UploadType) => {
    const { file, data } = uploadStates[type];
    if (!file || data.length === 0) {
      toast.error('Please select a valid file first');
      return;
    }

    try {
      // Start upload
      setUploadStates(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          isUploading: true,
          progress: 0,
          error: null,
          success: false,
        },
      }));

      // Simulate progress (in a real app, you'd use actual upload progress)
      const progressInterval = setInterval(() => {
        setUploadStates(prev => {
          const currentProgress = prev[type].progress;
          const newProgress = Math.min(currentProgress + 10, 90);
          return {
            ...prev,
            [type]: {
              ...prev[type],
              progress: newProgress,
            },
          };
        });
      }, 300);

      // Call the appropriate API based on upload type
      let response;
      switch (type) {
        case 'faculty':
          response = await adminAPI.uploadFacultyData(data);
          break;
        case 'exam':
          response = await adminAPI.uploadExamData(data);
          break;
        case 'classroom':
          response = await adminAPI.uploadClassroomData(data);
          break;
      }

      clearInterval(progressInterval);

      if (response.success) {
        setUploadStates(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            isUploading: false,
            progress: 100,
            success: true,
          },
        }));
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} data uploaded successfully`);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      setUploadStates(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          isUploading: false,
          progress: 0,
          error: error.message || 'An error occurred during upload',
        },
      }));
      toast.error(`Failed to upload ${type} data: ${error.message}`);
    }
  };

  const renderUploadCard = (type: UploadType, title: string, description: string, sampleFormat: string) => {
    const state = uploadStates[type];
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor={`${type}-file`} className="cursor-pointer">
                  <div className="flex items-center justify-center w-full px-4 py-12 border-2 border-dashed rounded-lg border-gray-300 hover:border-primary transition-colors">
                    {state.file ? (
                      <div className="text-center">
                        <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="font-medium">{state.file.name}</p>
                        <p className="text-sm text-gray-500">{(state.file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">CSV files only</p>
                      </div>
                    )}
                    <Input
                      id={`${type}-file`}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, type)}
                    />
                  </div>
                </Label>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button
                  type="button"
                  onClick={() => document.getElementById(`${type}-file`)?.click()}
                  variant="outline"
                  disabled={state.isUploading}
                >
                  {state.file ? 'Change File' : 'Select File'}
                </Button>
                <Button
                  type="button"
                  onClick={() => handleUpload(type)}
                  disabled={!state.file || state.isUploading || state.success}
                >
                  {state.isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : state.success ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Uploaded
                    </>
                  ) : (
                    'Upload Data'
                  )}
                </Button>
              </div>
            </div>

            {state.isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{state.progress}%</span>
                </div>
                <Progress value={state.progress} className="h-2" />
              </div>
            )}

            {state.error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            {state.data.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Preview ({state.data.length} rows)</h4>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {state.headers.map((header) => (
                          <TableHead key={header}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {state.data.slice(0, 5).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {state.headers.map((header) => (
                            <TableCell key={`${rowIndex}-${header}`}>
                              {row[header] !== undefined ? String(row[header]) : ''}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                      {state.data.length > 5 && (
                        <TableRow>
                          <TableCell colSpan={state.headers.length} className="text-center text-sm text-gray-500">
                            ... and {state.data.length - 5} more rows
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium text-sm mb-2">Expected CSV Format:</h4>
              <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                {sampleFormat}
              </pre>
              <Button
                variant="link"
                size="sm"
                className="text-xs p-0 h-auto mt-2"
                onClick={() => {
                  // Create a sample CSV and trigger download
                  const csvContent = sampleFormat;
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.setAttribute('href', url);
                  link.setAttribute('download', `${type}-sample.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download Sample CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <SEO title="Data Upload - Admin Dashboard" />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Data Upload</h1>
          <p className="text-gray-600">Upload and manage faculty, exam, and classroom data</p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UploadType)}>
          <TabsList>
            <TabsTrigger value="faculty">Faculty Data</TabsTrigger>
            <TabsTrigger value="exam">Exam Data</TabsTrigger>
            <TabsTrigger value="classroom">Classroom Data</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="faculty">
              {renderUploadCard(
                'faculty',
                'Upload Faculty Data',
                'Upload a CSV file containing faculty information. Ensure the file follows the expected format.',
                'id,name,email,department,role\n1,John Doe,john@example.com,Computer Science,Professor\n2,Jane Smith,jane@example.com,Mathematics,Associate Professor'
              )}
            </TabsContent>
            
            <TabsContent value="exam">
              {renderUploadCard(
                'exam',
                'Upload Exam Data',
                'Upload a CSV file containing exam schedule information. Ensure the file follows the expected format.',
                'id,exam_name,date,start_time,end_time,department\n1,Midterm 1,2023-11-15,09:00,11:00,Computer Science\n2,Midterm 2,2023-11-20,14:00,16:00,Mathematics'
              )}
            </TabsContent>
            
            <TabsContent value="classroom">
              {renderUploadCard(
                'classroom',
                'Upload Classroom Data',
                'Upload a CSV file containing classroom information. Ensure the file follows the expected format.',
                'id,room_number,building,capacity,type\n101,101,Main,50,Lecture Hall\n201,201,Science,30,Lab'
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
