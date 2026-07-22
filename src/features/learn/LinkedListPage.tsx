import React from 'react';
import DataStructurePageLayout from './components/DataStructurePageLayout';

export default function LinkedListPage() {
  return (
    <DataStructurePageLayout
      type="linked-list"
      title="Linked List"
      visualizerDsName="Linked List"
      description="A linear collection of data elements where each points to the next. Allows efficient O(1) insertions/deletions at known positions but requires O(n) sequential access."
      difficulty="Beginner"
      timeComplexities={{"access":"O(n)","search":"O(n)","insert":"O(1)*","delete":"O(1)*"}}
      content={
      <>
        <section>
          <h2>What is a Linked List?</h2>
          <p>A linked list is a linear data structure, in which the elements are not stored at contiguous memory locations. The elements in a linked list are linked using pointers.</p>
          <p>In simple words, a linked list consists of nodes where each node contains a data field and a reference(link) to the next node in the list.</p>
          
          <div className="not-prose bg-[var(--color-bg-tertiary)] rounded-2xl p-8 flex flex-col items-center shadow-inner my-10 overflow-x-auto w-full border border-[var(--color-border-subtle)]">
            <h3 className="text-white font-bold text-xl mb-8">Node Structure</h3>
            <div className="flex items-center gap-4 border-2 border-indigo-500/50 rounded-lg overflow-hidden shadow-lg bg-[var(--color-bg-primary)]">
              <div className="px-8 py-6 text-center border-r-2 border-indigo-500/50">
                <span className="block text-2xl font-bold text-white mb-1">Data</span>
                <span className="text-sm text-gray-400">Value</span>
              </div>
              <div className="px-8 py-6 text-center">
                <span className="block text-2xl font-bold text-indigo-400 mb-1">Next</span>
                <span className="text-sm text-gray-400">Pointer</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2>Singly Linked List</h2>
          <p>Every node stores address or reference of next node in list and the last node has next address or reference as NULL.</p>
          
          <div className="not-prose bg-[var(--color-bg-tertiary)] rounded-2xl p-8 flex flex-col items-center shadow-inner my-10 overflow-x-auto w-full border border-[var(--color-border-subtle)]">
             <div className="flex items-center text-white">
                <div className="text-center mr-4 text-gray-400 font-mono text-sm">
                  HEAD
                  <div className="h-6 w-0.5 bg-gray-500 mx-auto my-1"></div>
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-gray-500 mx-auto"></div>
                </div>
                {[10, 20, 30].map((val, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex border-2 border-indigo-500/50 rounded overflow-hidden bg-[var(--color-bg-primary)] shadow">
                      <div className="px-4 py-3 font-bold text-lg border-r-2 border-indigo-500/50">{val}</div>
                      <div className="px-3 py-3 flex items-center justify-center bg-indigo-500/10 text-indigo-300 font-bold">•</div>
                    </div>
                    {idx < 2 ? (
                      <div className="flex items-center px-2 text-indigo-400">
                        <div className="w-8 h-0.5 bg-indigo-400"></div>
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-indigo-400"></div>
                      </div>
                    ) : (
                      <div className="flex items-center px-2 text-red-400">
                        <div className="w-8 h-0.5 bg-red-400"></div>
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-red-400"></div>
                        <span className="ml-2 font-mono font-bold">NULL</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
             </div>
          </div>
        </section>

        <section>
          <h2>Doubly Linked List</h2>
          <p>Here, there are two references associated with each node, One of the reference points to the next node and one to the previous node.</p>
          <div className="not-prose bg-[var(--color-bg-tertiary)] rounded-2xl p-8 flex flex-col items-center shadow-inner my-10 overflow-x-auto w-full border border-[var(--color-border-subtle)]">
             <div className="flex items-center text-white mt-4">
                <div className="flex items-center mr-2 text-red-400">
                  <span className="mr-2 font-mono font-bold">NULL</span>
                  <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[8px] border-r-red-400"></div>
                  <div className="w-6 h-0.5 bg-red-400"></div>
                </div>
                {[10, 20, 30].map((val, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex border-2 border-emerald-500/50 rounded overflow-hidden bg-[var(--color-bg-primary)] shadow relative">
                      <div className="px-2 py-3 flex items-center justify-center bg-emerald-500/10 text-emerald-300 font-bold border-r-2 border-emerald-500/50 text-xs">Prev</div>
                      <div className="px-4 py-3 font-bold text-lg border-r-2 border-emerald-500/50 text-center min-w-[50px]">{val}</div>
                      <div className="px-2 py-3 flex items-center justify-center bg-emerald-500/10 text-emerald-300 font-bold text-xs">Next</div>
                    </div>
                    {idx < 2 ? (
                      <div className="flex flex-col px-2 text-emerald-400 justify-center h-full space-y-1 mx-1">
                        <div className="flex items-center">
                           <div className="w-8 h-0.5 bg-emerald-400"></div>
                           <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-emerald-400"></div>
                        </div>
                        <div className="flex items-center">
                           <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[6px] border-r-emerald-400"></div>
                           <div className="w-8 h-0.5 bg-emerald-400"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center px-2 text-red-400">
                        <div className="w-6 h-0.5 bg-red-400"></div>
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-red-400"></div>
                        <span className="ml-2 font-mono font-bold">NULL</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
             </div>
          </div>
        </section>
      </>
    }
    />
  );
}