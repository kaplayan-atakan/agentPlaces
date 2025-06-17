import React, { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { apiService } from '../../services/api.service';
import { FileInfo, QueueTask } from '../../types/file.types';
import './FileManager.css';

export const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [tasks, setTasks] = useState<QueueTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'upload' | 'files' | 'queue'>('upload');

  useEffect(() => {
    loadData();
    
    // Refresh data every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [filesResult, tasksResult] = await Promise.all([
        apiService.getFiles().catch(() => []),
        apiService.getRecentJobs('file_processing', 20).catch(() => []),
      ]);
      
      setFiles(filesResult);
      setTasks(tasksResult);
    } catch (error) {
      setError('Veri yüklenirken hata oluştu');
      console.error('Data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const result = await apiService.uploadFile(file);
      
      if (result.success) {
        // Create a processing task
        await apiService.createTask({
          name: `process-${file.name}`,
          type: 'file_processing',
          data: {
            fileId: result.data.fileId,
            fileName: file.name,
            fileType: file.type,
          },
          priority: 2,
        });
        
        // Refresh data
        await loadData();
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Dosya yükleme başarısız');
    }
  };

  const handleRetryTask = async (task: QueueTask) => {
    try {
      await apiService.retryTask(task.taskId, task.type);
      await loadData();
    } catch (error) {
      setError('Task yeniden başlatılamadı');
    }
  };

  const handleDeleteTask = async (task: QueueTask) => {
    try {
      await apiService.deleteTask(task.taskId, task.type);
      await loadData();
    } catch (error) {
      setError('Task silinemedi');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'active': return '⏳';
      case 'waiting': return '⏱️';
      case 'delayed': return '⏸️';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'failed': return '#dc3545';
      case 'active': return '#007bff';
      case 'waiting': return '#ffc107';
      case 'delayed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="file-manager loading">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="file-manager">
      <div className="file-manager-header">
        <h1>📁 Dosya Yöneticisi</h1>
        <p>Dosyalarınızı yükleyin, işleyin ve yönetin</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${selectedTab === 'upload' ? 'active' : ''}`}
          onClick={() => setSelectedTab('upload')}
        >
          📤 Dosya Yükle
        </button>
        <button 
          className={`tab ${selectedTab === 'files' ? 'active' : ''}`}
          onClick={() => setSelectedTab('files')}
        >
          📋 Dosyalarım ({files.length})
        </button>
        <button 
          className={`tab ${selectedTab === 'queue' ? 'active' : ''}`}
          onClick={() => setSelectedTab('queue')}
        >
          ⚙️ İşlem Kuyruğu ({tasks.length})
        </button>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button onClick={() => setError(null)}>✖️</button>
        </div>
      )}

      {selectedTab === 'upload' && (
        <div className="tab-content">
          <FileUpload onUpload={handleFileUpload} />
          
          <div className="upload-info">
            <h3>📊 Desteklenen Dosya Türleri</h3>
            <div className="file-types">
              <div className="file-type">
                <span className="icon">📄</span>
                <div>
                  <strong>PDF</strong>
                  <p>Metin çıkarma ve analiz</p>
                </div>
              </div>
              <div className="file-type">
                <span className="icon">📝</span>
                <div>
                  <strong>Word (DOCX)</strong>
                  <p>Doküman analizi</p>
                </div>
              </div>
              <div className="file-type">
                <span className="icon">📊</span>
                <div>
                  <strong>Excel (XLSX)</strong>
                  <p>Veri analizi</p>
                </div>
              </div>
              <div className="file-type">
                <span className="icon">📧</span>
                <div>
                  <strong>E-posta (EML)</strong>
                  <p>Mail analizi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'files' && (
        <div className="tab-content">
          {files.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📂</span>
              <h3>Henüz dosya yüklenmemiş</h3>
              <p>Dosya yüklemek için "Dosya Yükle" sekmesini kullanın</p>
            </div>
          ) : (
            <div className="files-grid">
              {files.map((file) => (
                <div key={file.id} className="file-card">
                  <div className="file-header">
                    <span className="file-icon">📄</span>
                    <div className="file-info">
                      <h4>{file.name}</h4>
                      <p>{formatFileSize(file.size)} • {file.type}</p>
                    </div>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(file.status) }}
                    >
                      {file.status}
                    </span>
                  </div>
                  
                  <div className="file-meta">
                    <small>Yüklenme: {new Date(file.uploadedAt).toLocaleString()}</small>
                  </div>

                  {file.analysis && (
                    <div className="file-analysis">
                      <h5>📈 Analiz Sonuçları</h5>
                      <p>Metin uzunluğu: {file.analysis.textContent?.length || 0} karakter</p>
                      {file.analysis.extractedAt && (
                        <small>Analiz: {new Date(file.analysis.extractedAt).toLocaleString()}</small>
                      )}
                    </div>
                  )}

                  <div className="file-actions">
                    {file.url && (
                      <button className="btn btn-primary">📥 İndir</button>
                    )}
                    <button className="btn btn-danger">🗑️ Sil</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedTab === 'queue' && (
        <div className="tab-content">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">⚙️</span>
              <h3>İşlem kuyruğu boş</h3>
              <p>Dosya yüklediğinizde işlem görevleri burada görünecek</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div key={task.taskId} className="task-card">
                  <div className="task-header">
                    <span className="task-icon">{getStatusIcon(task.status)}</span>
                    <div className="task-info">
                      <h4>{task.name}</h4>
                      <p>Tür: {task.type} • Öncelik: {task.priority}</p>
                    </div>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="task-meta">
                    <small>Oluşturulma: {new Date(task.created).toLocaleString()}</small>
                    {task.processed && (
                      <small>İşlenme: {new Date(task.processed).toLocaleString()}</small>
                    )}
                    {task.finished && (
                      <small>Tamamlanma: {new Date(task.finished).toLocaleString()}</small>
                    )}
                  </div>

                  {task.progress !== undefined && task.progress > 0 && (
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                      <span className="progress-text">{task.progress}%</span>
                    </div>
                  )}

                  {task.error && (
                    <div className="task-error">
                      <strong>❌ Hata:</strong> {task.error}
                    </div>
                  )}

                  <div className="task-actions">
                    {task.status === 'failed' && (
                      <button 
                        className="btn btn-warning"
                        onClick={() => handleRetryTask(task)}
                      >
                        🔄 Yeniden Dene
                      </button>
                    )}
                    {['completed', 'failed'].includes(task.status) && (
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteTask(task)}
                      >
                        🗑️ Sil
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
