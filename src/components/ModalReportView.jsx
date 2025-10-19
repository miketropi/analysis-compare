'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useModal } from '@/hooks/useModal';
import Modal from '@/components/Modal';
import { Eye, Wrench, Pencil, Copy, CircleX, Save } from 'lucide-react';
import Table from './Table';
import { textareaToHtml, filterTextContent, highlightMatchingParagraphs, removeAllAttributesFromHtml } from '@/lib/helpers';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism.css';

export default function ModalReportView({ reportItem }) {
  const [sourceStandard, setSourceStandard] = useState(null);
  const [editSourceStandard, setEditSourceStandard] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();

  const backupSourceStandard = useRef(null);

  const getSourceStandard = async () => {
    try {
      const res = await fetch(`/api/source-standard/${reportItem?.name}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if(!data?.content || !data.content) {
          return;
        };

        setSourceStandard(JSON.parse(data.content));
        backupSourceStandard.current = JSON.parse(data.content);
      } else {

        const dataInit = reportItem?.report ? JSON.parse(reportItem?.report).map(i => {
          return {
            name: i.name,
            sourceText: "",
          }
        }) : [];

        setSourceStandard(dataInit);
        backupSourceStandard.current = dataInit;
        
        console.log('Error: Failed to fetch source standard');
      }
    } catch (err) {

      console.log('Error: Failed to fetch source standard:', err);
    }
  }

  const onChangeSourceStandardItem = (value, name) => {
    setSourceStandard(prev => prev.map(item => item.name === name ? { ...item, sourceText: value } : item));
  }

  useEffect(() => {
    if(!isOpen) return;
    getSourceStandard();
  }, [isOpen])

  const onUseReportSourceText = async (e) => {
    // console.log(reportItem)
    fetch('/api/update-source-standard', {
      method: 'POST',
      body: JSON.stringify({
        name: reportItem?.name,
        report: JSON.parse(reportItem?.report)
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
    })
    .catch(err => {
      console.error(err)
    })
  }

  const onSaveSourceStandard = async () => {

    await fetch('/api/update-source-standard', {
      method: 'POST',
      body: JSON.stringify({
        name: reportItem?.name,
        report: sourceStandard
      })
    })
    .then(res => res.json())
    .then(data => {
      // console.log(data)
      backupSourceStandard.current = sourceStandard;
    })
    .catch(err => {
      console.error(err)
    })

    setEditSourceStandard(false);
  }

  const columns = useCallback(() => {
    return [
      {
        header: 'Name',
        key: 'name',
        render: (v, row) => {
          // Remove any HTML tags from the sourceText value (convert to plain text)
          // let reportSourceText = filterTextContent(row.sourceText);

          // let __sourceStandard = sourceStandard ? sourceStandard.find(item => item.name === row.name)?.sourceText : '';
          // let sourceStandardText = filterTextContent(__sourceStandard);

          return <h4 className="font-semibold text-black __content">{ v }</h4>  
        }
      },
      {
        header: 'report sourceText',
        key: 'sourceText',
        width: '40%',
        render: (v, row) => {

          // highlightMatchingParagraphs
          const __reportSourceText_remove_attr = removeAllAttributesFromHtml(v);
          // const __sourceStandard_remove_attr = sourceStandard ? sourceStandard.find(item => item.name === row.name)?.sourceText : '';
          
          // const [highlightedReport, highlightedSourceStandard] = highlightMatchingParagraphs(__reportSourceText_remove_attr, __sourceStandard_remove_attr, { preserveHtml: true });

          return <>
            <div 
              className="__content" 
              dangerouslySetInnerHTML={{ __html: __reportSourceText_remove_attr || "N/A" }}
            >
            </div>
            {
              row?.comment && (
                <>
                  <hr className="my-2" />
                  <div className="text-xs __content">
                    Comment: <span className="text-black/70 font-mono" dangerouslySetInnerHTML={{ __html: row?.comment }}></span>
                  </div>
                </>
              )
            }
          </>
        }
      },
      {
        header: (
          <div className="flex items-center justify-between gap-2">
            <span>source Standard</span> 
            <div className="flex items-center gap-2">
              {/* {
                !editSourceStandard && (
                  <button className="flex items-center gap-2 px-2 py-2 text-xs font-mono bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500" title={ `Use "report sourceText" to make "source Standard"` } onClick={ onUseReportSourceText }> 
                    <Copy className="w-3 h-3"  />
                    <span>Use report sourceText</span>
                  </button>
                )
              } */}
              
              {
                editSourceStandard && (
                  <button className="flex items-center gap-2 px-2 py-2 text-xs font-mono bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500" title={ `Use "report sourceText" to make "source Standard"` } onClick={ onSaveSourceStandard }> 
                    <Save className="w-3 h-3"  />
                    <span>Save</span>
                  </button>
                )
              }
  
              <button className="flex items-center gap-2 px-2 py-2 text-xs font-mono bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500" onClick={ () => {
                let mode = !editSourceStandard
                setEditSourceStandard(mode)

                if(mode == false) {
                  // back to backup source 
                  setSourceStandard(backupSourceStandard.current)
                }
              } }> 
                {
                  editSourceStandard ? (
                    <>
                      <CircleX className="w-3 h-3" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </>
                  )
                }
              </button>
            </div>
          </div>
          ),
        width: '40%',
        render: (v, row) => {
          // find sourceStandard content by name 
          const compareText = sourceStandard ? sourceStandard.find(item => item.name === row.name)?.sourceText : '';     
          // console.log('sourceStandard', sourceStandard.find(i => i.name === row.name)?.sourceText) 
          return <>
            {
              editSourceStandard ? (
                
                <div>
                  <p className="text-xs mb-2">Edit content:</p>
                  <textarea 
                    className="w-full p-2 border border-gray-300 rounded font-mono text-xs" 
                    rows={ 10 } 
                    value={ compareText || "" } 
                    onChange={ e => onChangeSourceStandardItem(e.target.value, row.name) }></textarea>
                  {/* <Editor 
                    value={ compareText || "" }
                    onValueChange={code => onChangeSourceStandardItem(code, row.name)}
                    highlight={code => highlight(code, languages.html)}
                    padding={10}
                    style={{
                      border: `solid 1px black`,
                      background: `white`,
                      fontFamily: 'monospace',
                      fontSize: `12px`,
                      minHeight: `120px`
                    }}
                  /> */}
                </div>
              ) : (
                <div className="__content" dangerouslySetInnerHTML={{ __html: textareaToHtml(compareText) || "N/A" }}></div>
              )
            }
          </>;
        }
      },
    ]
  }, [sourceStandard, editSourceStandard]);

  const modalTitle = (
    <div>
      Report View: <strong className="font-mono">{ reportItem?.name }</strong>
    </div>
  )

  return (
    <>
      <button 
        className="flex items-center gap-2 border-b pb-1 cursor-pointer hover:opacity-70" 
        onClick={() => openModal(reportItem)}>
        <Eye className="w-4 h-4" />
        <span>View Compare</span>
      </button>
      <Modal isOpen={isOpen} onClose={closeModal} title={ modalTitle } size="2xl">
        {/* { console.log( JSON.parse(reportItem.report) ) } */}
        {
          reportItem?.report && 
          <Table data={JSON.parse(reportItem.report)} columns={columns()} />
        }
      </Modal>
    </>
  );
}