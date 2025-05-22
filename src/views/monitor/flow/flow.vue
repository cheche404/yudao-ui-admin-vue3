<template>
  <div style="height: 1200px; width: 100%; border: 1px solid #e5e7eb; position: relative;">
    <!-- Hierarchy Level Dropdown and Reset Button -->
    <div style="position: absolute; top: 10px; left: 10px; z-index: 10; display: flex; align-items: center;">
      <label for="hierarchy-level" style="margin-right: 8px;">层级选择：</label>
      <select id="hierarchy-level" v-model="selectedHierarchyLevel" @change="onHierarchyLevelChange">
        <option value="0">所有层级</option>
        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
      </select>
      <button @click="resetFlow" style="margin-left: 12px; padding: 6px 12px; background: #3b82f6; color: #ffffff; border: none; border-radius: 4px; cursor: pointer;">
        重置
      </button>
    </div>

    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :default-zoom="1"
      :min-zoom="0.1"
      :max-zoom="4"
      @node-click="onNodeClick"
      @node-dblclick="onNodeDblClick"
      @pane-ready="onPaneReady"
    >
      <!-- Custom Nodes -->
      <template #node-pod="{ id, data }">
        <div class="custom-node" :class="{ faded: isFaded(id) }" @click="onNodeClick($event, { id, data })" @dblclick="onNodeDblClick($event, { id, data })">
          <div class="node-icon">
            <i class="fas fa-box-open"></i>
          </div>
          <div class="node-label">{{ data.label }}</div>
          <div class="node-status" :class="data.status"></div>
        </div>
      </template>

      <template #node-service="{ id, data }">
        <div class="custom-node" :class="{ faded: isFaded(id) }" @click="onNodeClick($event, { id, data })" @dblclick="onNodeDblClick($event, { id, data })">
          <div class="node-icon">
            <i class="fas fa-network-wired"></i>
          </div>
          <div class="node-label">{{ data.label }}</div>
          <div class="node-status" :class="data.status"></div>
        </div>
      </template>

      <template #node-database="{ id, data }">
        <div class="custom-node" :class="{ faded: isFaded(id) }" @click="onNodeClick($event, { id, data })" @dblclick="onNodeDblClick($event, { id, data })">
          <div class="node-icon">
            <i class="fas fa-database"></i>
          </div>
          <div class="node-label">{{ data.label }}</div>
          <div class="node-status" :class="data.status"></div>
        </div>
      </template>

      <template #node-ingress="{ id, data }">
        <div class="custom-node" :class="{ faded: isFaded(id) }" @click="onNodeClick($event, { id, data })" @dblclick="onNodeDblClick($event, { id, data })">
          <div class="node-icon">
            <i class="fas fa-sign-in-alt"></i>
          </div>
          <div class="node-label">{{ data.label }}</div>
          <div class="node-status" :class="data.status"></div>
        </div>
      </template>

      <template #node-storage="{ id, data }">
        <div class="custom-node" :class="{ faded: isFaded(id) }" @click="onNodeClick($event, { id, data })" @dblclick="onNodeDblClick($event, { id, data })">
          <div class="node-icon">
            <i class="fas fa-hdd"></i>
          </div>
          <div class="node-label">{{ data.label }}</div>
          <div class="node-status" :class="data.status"></div>
        </div>
      </template>

      <template #node-config="{ id, data }">
        <div class="custom-node" :class="{ faded: isFaded(id) }" @click="onNodeClick($event, { id, data })" @dblclick="onNodeDblClick($event, { id, data })">
          <div class="node-icon">
            <i class="fas fa-cogs"></i>
          </div>
          <div class="node-label">{{ data.label }}</div>
          <div class="node-status" :class="data.status"></div>
        </div>
      </template>

      <!-- Background -->
      <Background variant="dots" :gap="24" :size="1.2" />
      <!-- Controls with Fit View -->
      <Controls />
      <!-- MiniMap - Interactive -->
      <MiniMap :interactive="true" node-stroke-width="3" zoomable pannable />
    </VueFlow>

    <!-- Modal for Node Details -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">×</span>
        <h2>{{ selectedNode?.data?.label }}</h2>
        <p><strong>类型:</strong> {{ selectedNode?.type }}</p>
        <p><strong>状态:</strong> {{ selectedNode?.data?.status }}</p>
        <p><strong>ID:</strong> {{ selectedNode?.id }}</p>
        <p v-if="selectedNode?.position">
          <strong>位置:</strong>
          X: {{ selectedNode.position.x?.toFixed(2) || 'N/A' }},
          Y: {{ selectedNode.position.y?.toFixed(2) || 'N/A' }}
        </p>
        <button @click="closeModal">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { nextTick } from 'vue';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@fortawesome/fontawesome-free/css/all.css';

// Status types
const statusTypes = ['healthy', 'warning', 'error'];

// Access to the Vue Flow instance
const { onPaneReady: onPaneReadyInternal, fitView, onNodeDragStop } = useVueFlow();

// When the flow is ready
const onPaneReady = (instance) => {
  onPaneReadyInternal(instance);
  nextTick(() => {
    fitView({ padding: 0.1 });
  });
};

// Generate position with larger spacing to avoid overlaps
const generatePosition = (x, y, randomFactor = 30) => {
  return {
    x: x + Math.random() * randomFactor - randomFactor / 2,
    y: y + Math.random() * randomFactor - randomFactor / 2
  };
};

// Generate random status
const randomStatus = () => {
  const weights = [0.7, 0.2, 0.1]; // 70% healthy, 20% warning, 10% error
  const random = Math.random();

  if (random < weights[0]) return 'healthy';
  if (random < weights[0] + weights[1]) return 'warning';
  return 'error';
};

// Initial empty refs
const nodes = ref([]);
const edges = ref([]);
const allNodes = ref([]);
const allEdges = ref([]);

// Modal state
const showModal = ref(false);
const selectedNode = ref(null);

// Hierarchy level state
const selectedHierarchyLevel = ref(0); // 0 means show all levels
const focusedNodeId = ref(null);
const highlightedNodes = ref(new Set());
const highlightedEdges = ref(new Set());

// Populate with data
const initializeFlow = () => {
  // Create node data
  const nodeData = [];

  // 1. Ingress Controller
  nodeData.push({
    id: 'ingress-1',
    type: 'ingress',
    position: { x: 0, y: 0 },
    data: { label: 'Ingress Controller', status: 'healthy' }
  });

  // 2. Frontend Services
  const frontendServices = [
    { id: 'frontend-1', label: 'Web UI Service' },
    { id: 'frontend-2', label: 'Mobile API Service' },
    { id: 'frontend-3', label: 'Admin Service' }
  ];

  frontendServices.forEach((service, index) => {
    nodeData.push({
      id: service.id,
      type: 'service',
      position: generatePosition(-450 + index * 450, 200),
      data: { label: service.label, status: randomStatus() }
    });
  });

  // 3. Frontend Pods (3 per service)
  frontendServices.forEach((service, sIndex) => {
    for (let i = 0; i < 3; i++) {
      nodeData.push({
        id: `${service.id}-pod-${i+1}`,
        type: 'pod',
        position: generatePosition(-450 + sIndex * 450, 350 + i * 100),
        data: { label: `${service.label.split(' ')[0]} Pod ${i+1}`, status: randomStatus() }
      });
    }
  });

  // 4. Backend Services
  const backendServices = [
    { id: 'auth-service', label: 'Auth Service' },
    { id: 'user-service', label: 'User Service' },
    { id: 'product-service', label: 'Product Service' },
    { id: 'order-service', label: 'Order Service' },
    { id: 'payment-service', label: 'Payment Service' },
    { id: 'notification-service', label: 'Notification Service' }
  ];

  backendServices.forEach((service, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;

    nodeData.push({
      id: service.id,
      type: 'service',
      position: generatePosition(-600 + col * 600, 650 + row * 400),
      data: { label: service.label, status: randomStatus() }
    });
  });

  // 5. Backend Pods (2-4 per service)
  backendServices.forEach((service, sIndex) => {
    const podsCount = Math.floor(Math.random() * 3) + 2; // 2-4 pods per service
    const row = Math.floor(sIndex / 3);
    const col = sIndex % 3;

    for (let i = 0; i < podsCount; i++) {
      nodeData.push({
        id: `${service.id}-pod-${i+1}`,
        type: 'pod',
        position: generatePosition(-600 + col * 600, 800 + row * 400 + i * 100),
        data: { label: `${service.label.split(' ')[0]} Pod ${i+1}`, status: randomStatus() }
      });
    }
  });

  // 6. Databases
  const databases = [
    { id: 'user-db', label: 'User Database', x: -600, y: 1400 },
    { id: 'product-db', label: 'Product Database', x: 0, y: 1400 },
    { id: 'order-db', label: 'Order Database', x: 600, y: 1400 }
  ];

  databases.forEach(db => {
    nodeData.push({
      id: db.id,
      type: 'database',
      position: { x: db.x, y: db.y },
      data: { label: db.label, status: randomStatus() }
    });
  });

  // 7. Storage Volumes
  const storageVolumes = [
    { id: 'storage-1', label: 'Log Storage', x: -300, y: 1600 },
    { id: 'storage-2', label: 'Backup Storage', x: 300, y: 1600 }
  ];

  storageVolumes.forEach(storage => {
    nodeData.push({
      id: storage.id,
      type: 'storage',
      position: { x: storage.x, y: storage.y },
      data: { label: storage.label, status: randomStatus() }
    });
  });

  // 8. Config Maps and Secrets
  const configs = [
    { id: 'config-1', label: 'API Configs', x: -900, y: 650 },
    { id: 'config-2', label: 'DB Secrets', x: -900, y: 850 },
    { id: 'config-3', label: 'Env Configs', x: -900, y: 1050 }
  ];

  configs.forEach(config => {
    nodeData.push({
      id: config.id,
      type: 'config',
      position: { x: config.x, y: config.y },
      data: { label: config.label, status: randomStatus() }
    });
  });

  // Store all nodes
  nodes.value = nodeData;
  allNodes.value = [...nodeData];

  // Create edges
  const edgeData = [];
  let edgeId = 1;

  // Connect ingress to frontend services
  frontendServices.forEach(service => {
    edgeData.push({
      id: `e${edgeId++}`,
      source: 'ingress-1',
      target: service.id,
      animated: true,
      label: 'HTTP',
      style: { strokeDasharray: '5, 5', strokeWidth: '2.5px' }
    });
  });

  // Connect frontend services to pods
  frontendServices.forEach(service => {
    for (let i = 0; i < 3; i++) {
      edgeData.push({
        id: `e${edgeId++}`,
        source: service.id,
        target: `${service.id}-pod-${i+1}`,
        animated: true,
        style: { strokeDasharray: '5, 5', strokeWidth: '2.5px' }
      });
    }
  });

  // Connect frontend pods to backend services
  frontendServices.forEach(frontService => {
    backendServices.forEach(backService => {
      if (Math.random() > 0.7) {
        const podIndex = Math.floor(Math.random() * 3) + 1;
        edgeData.push({
          id: `e${edgeId++}`,
          source: `${frontService.id}-pod-${podIndex}`,
          target: backService.id,
          animated: true,
          style: { strokeDasharray: '5, 5', strokeWidth: '2.5px' }
        });
      }
    });
  });

  // Connect backend services to pods
  backendServices.forEach(service => {
    const podsCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < podsCount; i++) {
      edgeData.push({
        id: `e${edgeId++}`,
        source: service.id,
        target: `${service.id}-pod-${i+1}`,
        animated: true,
        style: { strokeDasharray: '5, 5', strokeWidth: '2.5px' }
      });
    }
  });

  // Connect backend pods to databases
  backendServices.forEach(service => {
    const podsCount = nodes.value.filter(n => n.id.startsWith(`${service.id}-pod-`)).length;
    const podIndex = Math.floor(Math.random() * podsCount) + 1;
    let dbTarget = 'user-db';
    if (service.id.includes('product')) dbTarget = 'product-db';
    else if (service.id.includes('order') || service.id.includes('payment')) dbTarget = 'order-db';
    edgeData.push({
      id: `e${edgeId++}`,
      source: `${service.id}-pod-${podIndex}`,
      target: dbTarget,
      animated: true,
      label: 'Query',
      style: { strokeDasharray: '5, 5', strokeWidth: '2.5px' }
    });
  });

  // Connect databases to storage
  databases.forEach((db, index) => {
    const storageTarget = index % 2 === 0 ? 'storage-1' : 'storage-2';
    edgeData.push({
      id: `e${edgeId++}`,
      source: db.id,
      target: storageTarget,
      animated: true,
      label: 'Backup',
      style: { strokeDasharray: '5, 5', strokeWidth: '2.5px' }
    });
  });

  // Connect configs to services
  configs.forEach(config => {
    const serviceCount = Math.floor(Math.random() * 2) + 2;
    const allServices = [...frontendServices, ...backendServices];
    for (let i = 0; i < serviceCount; i++) {
      const serviceIndex = Math.floor(Math.random() * allServices.length);
      edgeData.push({
        id: `e${edgeId++}`,
        source: config.id,
        target: allServices[serviceIndex].id,
        animated: true,
        style: { strokeDasharray: '5, 5', strokeWidth: '2.5px' }
      });
    }
  });

  // Store all edges
  edges.value = edgeData;
  allEdges.value = [...edgeData];
};

// Initialize on mount
onMounted(() => {
  initializeFlow();
});

// Handle node drag stop to update allNodes
onNodeDragStop((event) => {
  const { node } = event;
  allNodes.value = allNodes.value.map(n =>
    n.id === node.id ? { ...n, position: { ...node.position } } : n
  );
});

// Reset flow to initial state
const resetFlow = () => {
  initializeFlow();
  selectedHierarchyLevel.value = 0;
  focusedNodeId.value = null;
  highlightedNodes.value.clear();
  highlightedEdges.value.clear();
  nodes.value = [...allNodes.value];
  edges.value = [...allEdges.value];
  nextTick(() => {
    fitView({ padding: 0.1 });
  });
};

// Handle node single click
const onNodeClick = (event, node) => {
  event.stopPropagation();
  focusedNodeId.value = node.id;

  if (selectedHierarchyLevel.value > 0) {
    highlightFromNode(node.id, selectedHierarchyLevel.value);
  } else {
    highlightAllRelatedNodes(node.id);
  }
};

const highlightAllRelatedNodes = (nodeId) => {
  highlightedNodes.value.clear();
  highlightedEdges.value.clear();

  const nodesToHighlight = new Set();
  const edgesToHighlight = new Set();
  const visited = new Set();

  const queue = [nodeId];
  visited.add(nodeId);

  while (queue.length > 0) {
    const currentId = queue.shift();

    nodesToHighlight.add(currentId);

    allEdges.value.forEach(edge => {
      if (edge.target === currentId && !visited.has(edge.source)) {
        edgesToHighlight.add(edge.id);
        nodesToHighlight.add(edge.source);
        queue.push(edge.source);
        visited.add(edge.source);
      }
      if (edge.source === currentId && !visited.has(edge.target)) {
        edgesToHighlight.add(edge.id);
        nodesToHighlight.add(edge.target);
        queue.push(edge.target);
        visited.add(edge.target);
      }
    });
  }

  highlightedNodes.value = nodesToHighlight;
  highlightedEdges.value = edgesToHighlight;

  nodes.value = nodes.value.map(node => ({
    ...node,
    class: nodesToHighlight.has(node.id) ? 'highlighted' : 'faded'
  }));

  edges.value = allEdges.value.map(edge => ({
    ...edge,
    class: edgesToHighlight.has(edge.id) ? 'highlighted' : 'faded'
  }));
};

// Handle node double click
const onNodeDblClick = (event, node) => {
  event.stopPropagation();
  event.preventDefault();

  console.log('Node double-clicked:', node.id, node.data.label, node);
  selectedNode.value = {
    ...node,
    type: node.type || 'unknown',
    position: node.position ? { ...node.position } : { x: 0, y: 0 }
  };
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  selectedNode.value = null;
};

// Update highlighted nodes and edges
const updateHighlight = (nodeId) => {
  highlightedNodes.value.clear();
  highlightedEdges.value.clear();
  highlightedNodes.value.add(nodeId);
  allEdges.value.forEach(edge => {
    if (edge.source === nodeId || edge.target === nodeId) {
      highlightedEdges.value.add(edge.id);
      highlightedNodes.value.add(edge.source);
      highlightedNodes.value.add(edge.target);
    }
  });
  edges.value = allEdges.value.map(edge => ({
    ...edge,
    class: highlightedEdges.value.has(edge.id) ? 'highlighted' : ''
  }));
};

// Check if a node should be faded
const isFaded = (nodeId) => {
  return focusedNodeId.value && !highlightedNodes.value.has(nodeId);
};

// Filter nodes and edges based on hierarchy level
const filterNodesAndEdgesForNode = (nodeId, maxLevels) => {
  const relatedNodes = new Set([nodeId]);
  const relatedEdges = new Set();
  const queue = [{ id: nodeId, level: 0 }];
  const visited = new Set([nodeId]);
  while (queue.length > 0) {
    const { id, level } = queue.shift();
    if (level >= maxLevels) continue;
    allEdges.value.forEach(edge => {
      if (edge.source === id && !visited.has(edge.target)) {
        relatedNodes.add(edge.target);
        relatedEdges.add(edge.id);
        queue.push({ id: edge.target, level: level + 1 });
        visited.add(edge.target);
      } else if (edge.target === id && !visited.has(edge.source)) {
        relatedNodes.add(edge.source);
        relatedEdges.add(edge.id);
        queue.push({ id: edge.source, level: level + 1 });
        visited.add(edge.source);
      }
    });
  }
  nodes.value = nodes.value.filter(node => relatedNodes.has(node.id));
  edges.value = allEdges.value
    .filter(edge => relatedEdges.has(edge.id))
    .map(edge => ({
      ...edge,
      class: highlightedEdges.value.has(edge.id) ? 'highlighted' : ''
    }));
};

// Handle hierarchy level change
const onHierarchyLevelChange = () => {
  if (selectedHierarchyLevel.value > 0 && focusedNodeId.value) {
    highlightFromNode(focusedNodeId.value, selectedHierarchyLevel.value);
  } else if (selectedHierarchyLevel.value > 0) {
    highlightFromNode('ingress-1', selectedHierarchyLevel.value);
  } else {
    nodes.value = [...allNodes.value];
    edges.value = [...allEdges.value];
    focusedNodeId.value = null;
    highlightedNodes.value.clear();
    highlightedEdges.value.clear();
    nextTick(() => {
      fitView({ padding: 0.1 });
    });
  }
};

const highlightFromNode = (nodeId, levels) => {
  highlightedNodes.value.clear();
  highlightedEdges.value.clear();

  const nodesToHighlight = new Set();
  const edgesToHighlight = new Set();
  const visited = new Set();

  const queue = [{ id: nodeId, currentLevel: 0 }];
  visited.add(nodeId);

  while (queue.length > 0) {
    const { id, currentLevel } = queue.shift();

    nodesToHighlight.add(id);

    if (currentLevel < levels) {
      allEdges.value.forEach(edge => {
        if (edge.source === id && !visited.has(edge.target)) {
          edgesToHighlight.add(edge.id);
          nodesToHighlight.add(edge.target);
          queue.push({ id: edge.target, currentLevel: currentLevel + 1 });
          visited.add(edge.target);
        } else if (edge.target === id && !visited.has(edge.source)) {
          edgesToHighlight.add(edge.id);
          nodesToHighlight.add(edge.source);
          queue.push({ id: edge.source, currentLevel: currentLevel + 1 });
          visited.add(edge.source);
        }
      });
    }
  }

  highlightedNodes.value = nodesToHighlight;
  highlightedEdges.value = edgesToHighlight;

  nodes.value = nodes.value.map(node => ({
    ...node,
    class: nodesToHighlight.has(node.id) ? 'highlighted' : 'faded'
  }));

  edges.value = allEdges.value.map(edge => ({
    ...edge,
    class: edgesToHighlight.has(edge.id) ? 'highlighted' : 'faded'
  }));
};

const highlightHierarchyLevel = (level) => {
  highlightedNodes.value.clear();
  highlightedEdges.value.clear();

  const rootNodeId = 'ingress-1';
  const nodesToHighlight = new Set();
  const edgesToHighlight = new Set();

  const queue = [{ id: rootNodeId, currentLevel: 0 }];
  const visited = new Set([rootNodeId]);

  while (queue.length > 0) {
    const { id, currentLevel } = queue.shift();

    if (currentLevel < level) {
      allEdges.value.forEach(edge => {
        if (edge.source === id && !visited.has(edge.target)) {
          edgesToHighlight.add(edge.id);
          nodesToHighlight.add(edge.target);
          queue.push({ id: edge.target, currentLevel: currentLevel + 1 });
          visited.add(edge.target);
        } else if (edge.target === id && !visited.has(edge.source)) {
          edgesToHighlight.add(edge.id);
          nodesToHighlight.add(edge.source);
          queue.push({ id: edge.source, currentLevel: currentLevel + 1 });
          visited.add(edge.source);
        }
      });
    }

    nodesToHighlight.add(id);
  }

  highlightedNodes.value = nodesToHighlight;
  highlightedEdges.value = edgesToHighlight;

  nodes.value = nodes.value.map(node => ({
    ...node,
    class: nodesToHighlight.has(node.id) ? 'highlighted' : 'faded'
  }));

  edges.value = allEdges.value.map(edge => ({
    ...edge,
    class: edgesToHighlight.has(edge.id) ? 'highlighted' : 'faded'
  }));
};
</script>

<style scoped>
.custom-node {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px;
  width: 150px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  user-select: none;
  z-index: 1;
}

.node-icon {
  margin-bottom: 8px;
  font-size: 18px;
}

.node-label {
  font-size: 12px;
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.node-status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 6px auto 0;
}

.node-status.healthy {
  background: #22c55e;
}

.node-status.warning {
  background: #f59e0b;
}

.node-status.error {
  background: #ef4444;
}

.custom-node.faded {
  opacity: 0.3;
}

:deep(.vue-flow__node-pod) {
  background: #f0f9ff;
  border-color: #93c5fd;
}

:deep(.vue-flow__node-service) {
  background: #f0fdf4;
  border-color: #86efac;
}

:deep(.vue-flow__node-database) {
  background: #fef3f2;
  border-color: #fda4af;
}

:deep(.vue-flow__node-ingress) {
  background: #f5f3ff;
  border-color: #c4b5fd;
}

:deep(.vue-flow__node-storage) {
  background: #fff7ed;
  border-color: #fdba74;
}

:deep(.vue-flow__node-config) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

:deep(.vue-flow__edge path) {
  stroke-width: 2.5px;
  stroke-dasharray: 5, 5;
}

:deep(.vue-flow__edge.animated path) {
  stroke-width: 3px;
  stroke-dasharray: 5, 5;
}

:deep(.vue-flow__edge.highlighted path) {
  stroke: #3b82f6;
  stroke-width: 4px;
  stroke-dasharray: 5, 5;
}

:deep(.vue-flow__edge:not(.highlighted) path) {
  stroke-opacity: 0.3;
  stroke-dasharray: 5, 5;
}

:deep(.vue-flow__minimap-mask) {
  fill: rgba(240, 240, 240, 0.6);
}

:deep(.vue-flow__minimap) {
  background-color: #f8fafc;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 20px;
  cursor: pointer;
}

.modal-content h2 {
  margin-top: 0;
}

.modal-content p {
  margin: 10px 0;
}

.modal-content button {
  padding: 8px 16px;
  background: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-content button:hover {
  background: #2563eb;
}

.custom-node.highlighted {
  border: 2px solid #3b82f6;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.custom-node.faded {
  opacity: 0.3;
}

:deep(.vue-flow__edge.highlighted path) {
  stroke: #3b82f6;
  stroke-width: 4px;
  stroke-dasharray: 0;
}

:deep(.vue-flow__edge.faded path) {
  stroke-opacity: 0.2;
  stroke-dasharray: 5, 5;
}
</style>
